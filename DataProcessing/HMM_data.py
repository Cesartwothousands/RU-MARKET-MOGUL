import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta


def read_symbols_from_file(filename):
    with open(filename, 'r') as f:
        symbols = f.readlines()
    return [s.strip() for s in symbols]


stock_symbols_file = 'AllStocks.txt'
stock_symbols = read_symbols_from_file(stock_symbols_file)

# Get data
end_date = datetime.now()
start_date = end_date - timedelta(days=365*10)

# Initialize an empty DataFrame to store processed data
processed_data = pd.DataFrame()

i = 1
for ticker in stock_symbols:
    try:
        data = yf.download(ticker, start=start_date,
                           end=end_date, interval="3mo")
    except Exception as e:
        print(f"Error downloading data for {ticker}: {e}")
        continue

    # Calculate required metrics
    processed_data_temp = pd.DataFrame()
    processed_data_temp['Close-Open/Open'] = (
        data['Close'] - data['Open']) / data['Open']
    processed_data_temp['High-Open/Open'] = (
        data['High'] - data['Open']) / data['Open']
    processed_data_temp['Open-Low/Open'] = (
        data['Open'] - data['Low']) / data['Open']
    processed_data_temp['Volume'] = data['Volume']
    processed_data_temp['Ticker'] = ticker
    processed_data_temp.index = data.index

    # Concatenate the processed data to the main DataFrame
    processed_data = pd.concat([processed_data, processed_data_temp])
    print(f"Processed data for {ticker} ({i}/{len(stock_symbols)})")
    i += 1

# Save processed data as a CSV file
processed_data.to_csv('processed_stock_data.csv')
