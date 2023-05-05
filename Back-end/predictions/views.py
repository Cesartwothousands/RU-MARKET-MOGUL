from django.shortcuts import render

# Create your views here.
import yfinance as yf
import pandas as pd
import numpy as np
import pickle
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler
import time
from django.http import JsonResponse

start = time.time()


def fetch_stock_prediction(request, symbol):
    symbol = symbol.upper()
    end_date = datetime.now()

    start_date = end_date - timedelta(days=14)
    data = yf.download(symbol, start=start_date, end=end_date,
                       interval="1h", progress=False)
    data["VPT"] = np.nan
    data["RSI"] = np.nan

    # Calculate VPT indicator
    data["Price Change"] = data["Close"] - data["Close"].shift(1)
    data["Volume Multiplier"] = data["Price Change"] * data["Volume"]
    data["VPT"] = data["Volume Multiplier"].cumsum()

    # Calculate RSI indicator
    delta = data["Close"].diff()
    gain, loss = delta.copy(), delta.copy()
    gain[gain < 0] = 0
    loss[loss > 0] = 0
    loss = abs(loss)

    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()

    rs = avg_gain / avg_loss
    data["RSI"] = 100 - (100 / (1 + rs))

    # Get the latest trading day data
    latest_data = data.iloc[-1:]

    # Determine if VPT and price are in sync (rising or falling)
    vpt_trend = 0
    if latest_data["VPT"].values[0] > data["VPT"].iloc[-2] and latest_data["Close"].values[0] > data["Close"].iloc[-2]:
        vpt_trend = 2  # Rising in sync
    elif latest_data["VPT"].values[0] < data["VPT"].iloc[-2] and latest_data["Close"].values[0] < data["Close"].iloc[-2]:
        vpt_trend = 1  # Falling in sync
    else:
        vpt_trend = 0  # No clear trend

    # Get RSI value
    rsi_value = latest_data["RSI"].values[0]

    if rsi_value <= 30:
        rsi_value = 2  # Oversold
    elif rsi_value >= 70:
        rsi_value = 1  # Overbought
    else:
        rsi_value = 0  # Neutral

    ########################################

    start_date = end_date - timedelta(days=90)

    data = yf.download(symbol, start=start_date, end=end_date,
                       interval="1d", progress=False)
    data["MACD"] = np.nan
    data["Signal"] = np.nan

    # Calculate MACD indicator
    exp12 = data["Close"].ewm(span=12, adjust=False).mean()
    exp26 = data["Close"].ewm(span=26, adjust=False).mean()
    macd = exp12 - exp26
    signal = macd.ewm(span=9, adjust=False).mean()
    data["MACD"] = macd
    data["Signal"] = signal

    # Get the latest trading day data
    latest_data = data.iloc[-1:]

    # Determine the MACD trend
    macd_trend = 0
    if latest_data["MACD"].values[0] >= latest_data["Signal"].values[0]:
        macd_trend = 2  # "Bullish"
    elif latest_data["MACD"].values[0] < latest_data["Signal"].values[0]:
        macd_trend = 1  # "Bearish"

    ########################################

    def get_stock_data(symbol):
        end_date = datetime.now() - timedelta(days=90)

        # First try: Get stock data for the past 10 years
        start_date = end_date - timedelta(days=365 * 5 + 90)
        try:
            stock_data = yf.download(
                symbol, start=start_date, end=end_date, interval='3mo', progress=False)
            if not stock_data.empty:
                return stock_data
        except Exception as e:
            print(f"Error downloading data for {symbol} (10 years): {e}")

        # Second try: Get stock data for the past 5 years
        start_date = end_date - timedelta(days=365 * 10)
        try:
            stock_data = yf.download(
                symbol, start=start_date, end=end_date, interval='3mo', progress=False)
            if not stock_data.empty:
                return stock_data
        except Exception as e:
            print(f"Error downloading data for {symbol} (5 years): {e}")

        # If both attempts failed, return an empty DataFrame
        return pd.DataFrame()

    def preprocess_new_stock_data(data):
        # Remove rows with Volume equal to 0
        processed_data = pd.DataFrame()
        processed_data['Close-Open/Open'] = (data['Close'] -
                                             data['Open']) / data['Open']
        processed_data['High-Open/Open'] = (data['High'] -
                                            data['Open']) / data['Open']
        processed_data['Open-Low/Open'] = (data['Open'] -
                                           data['Low']) / data['Open']
        processed_data['Volume'] = data['Volume']
        processed_data.index = data.index

        processed_data = processed_data[processed_data['Volume'] != 0]

        # Remove rows containing NaN values
        processed_data = processed_data.dropna()

        # Remove rows containing infinite values
        numeric_columns = processed_data.select_dtypes(
            include=[np.number]).columns
        for column in numeric_columns:
            if np.isinf(processed_data[column]).any():
                processed_data = processed_data[~np.isinf(
                    processed_data[column])]

        # Remove rows where the first three attributes are all 0
        processed_data = processed_data[~((processed_data['Close-Open/Open'] == 0) &
                                        (processed_data['High-Open/Open'] == 0) & (processed_data['Open-Low/Open'] == 0))]

        # Take absolute values for 'High-Open/Open' and 'Open-Low/Open' columns
        processed_data['High-Open/Open'] = processed_data['High-Open/Open'].abs()
        processed_data['Open-Low/Open'] = processed_data['Open-Low/Open'].abs()

        # Standardize the data
        scaler = StandardScaler()
        processed_data[['Close-Open/Open', 'High-Open/Open', 'Open-Low/Open', 'Volume']
                       ] = scaler.fit_transform(processed_data[['Close-Open/Open', 'High-Open/Open', 'Open-Low/Open', 'Volume']])

        return processed_data

    stock_data = get_stock_data(symbol)
    processed_stock_data = preprocess_new_stock_data(stock_data)

    with open("F:\MSCS\ECE568_Web App\RU-MARKET-MOGUL\Back-end\predictions\hmm_model.pkl", "rb") as f:
        model = pickle.load(f)

    hidden_states = model.predict(processed_stock_data)

    # Calculate average close price change for each hidden state
    state_price_changes = []
    for i in range(model.n_components):
        state_data = processed_stock_data[hidden_states == i]
        avg_close_change = state_data['Close-Open/Open'].mean()
        state_price_changes.append(avg_close_change)

    # Predict next day's close price
    current_state = hidden_states[-1]
    next_close_change = state_price_changes[current_state]
    current_close_price = stock_data['Close'].iloc[-1]
    predicted_next_close_price = current_close_price * (1 + next_close_change)
    HMM_prediction = 0

    if next_close_change >= 0:
        HMM_prediction = 1
    else:
        HMM_prediction = 0

    ########################################
    result = {
        'vpt_trend': vpt_trend,
        'rsi_value': rsi_value,
        'macd_trend': macd_trend,
        'HMM_prediction': HMM_prediction
    }

    return JsonResponse(result)

    '''
    [    [2,1,0],[2,1,0],[2,1,0],[1,0]    ]
    '''


'''
print(fetch_stock_prediction("AAPL"))
print(time.time()-start)
'''
