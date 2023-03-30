import pandas as pd
import numpy as np
from yahoo_fin import stock_info as si
import time
import random
import os

start_time = time.time()

folder_path = "Local Dataset"

# Get symbol from sp500
sp500_list = si.tickers_sp500()
selected_stocks = sp500_list
print(selected_stocks)

# Get data from yahoo_fin


def get_stock_data(stock_symbol):
    stock_data = si.get_data(stock_symbol)
    stock_data.reset_index(inplace=True)
    stock_data['Symbol'] = stock_symbol
    return stock_data


# Get all data in one list
train_data = []
test_data = []
train_ratio = 0.7
num = 0
for stock in selected_stocks:
    stock_data = get_stock_data(stock)
    stock_df = pd.DataFrame(stock_data, columns=[
                            'adjclose', 'volume', 'Symbol'])
    if (random.random() < train_ratio and num < train_ratio*len(selected_stocks)):
        num += 1
        train_data.append(stock_df)
    else:
        test_data.append(stock_df)
        # 'date', 'open', 'high', 'low', 'close', 'adjclose', 'volume', 'Symbol'
    print(num/len(selected_stocks))
# Print time
print("--- %s seconds ---" % (time.time() - start_time))

# Build directory
os.makedirs("train_data_csv", exist_ok=True)
os.makedirs("test_data_csv", exist_ok=True)

# Store data in csv
for i, stock_data in enumerate(train_data):
    stock_data.to_csv(
        f"{folder_path}/train_data_csv/stock_{i}.csv", index=False)
# Print time
print("--- %s seconds ---" % (time.time() - start_time))

for i, stock_data in enumerate(test_data):
    stock_data.to_csv(
        f"{folder_path}/test_data_csv/stock_{i}.csv", index=False)
# Print time
print("--- %s seconds ---" % (time.time() - start_time))
