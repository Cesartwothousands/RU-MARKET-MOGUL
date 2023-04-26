import yfinance as yf
import pandas as pd
import numpy as np
import pickle
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler
from hmmlearn import hmm
import time

t = time.time()


def get_stock_data(symbol):
    end_date = datetime.now() - timedelta(days=90)

    # First try: Get stock data for the past 10 years
    start_date = end_date - timedelta(days=365 * 5 + 90)
    try:
        stock_data = yf.download(
            symbol, start=start_date, end=end_date, interval='3mo')
        if not stock_data.empty:
            return stock_data
    except Exception as e:
        print(f"Error downloading data for {symbol} (10 years): {e}")

    # Second try: Get stock data for the past 5 years
    start_date = end_date - timedelta(days=365 * 10)
    try:
        stock_data = yf.download(
            symbol, start=start_date, end=end_date, interval='3mo')
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
    numeric_columns = processed_data.select_dtypes(include=[np.number]).columns
    for column in numeric_columns:
        if np.isinf(processed_data[column]).any():
            processed_data = processed_data[~np.isinf(processed_data[column])]

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


symbol = "AAPL"
stock_data = get_stock_data(symbol)
processed_stock_data = preprocess_new_stock_data(stock_data)

with open("hmm_model.pkl", "rb") as f:
    model = pickle.load(f)

hidden_states = model.predict(processed_stock_data)

# Calculate average close price change for each hidden state
state_price_changes = []
for i in range(model.n_components):
    state_data = processed_stock_data[hidden_states == i]
    avg_close_change = state_data['Close-Open/Open'].mean()
    state_price_changes.append(avg_close_change)

print(hidden_states, state_price_changes)
# Predict next day's close price
current_state = hidden_states[-1]
next_close_change = state_price_changes[current_state]
current_close_price = stock_data['Close'].iloc[-1]
predicted_next_close_price = current_close_price * (1 + next_close_change)
'''
3 components, MSE:0.33

if next_close_change>0:
    return 2
else :
    retun 1
'''

print("Time taken:", time.time()-t)

print("Predicted next close price:", predicted_next_close_price)
