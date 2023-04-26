from django.shortcuts import render

# Create your views here.
import yfinance as yf
from datetime import datetime, timedelta
from django.http import JsonResponse


def fetch_stock_detail_graph(request, symbol):
    symbol = symbol.upper()
    end_date = datetime.now()
    width = 20

    def yf_donwload_data(date, interval):
        stock_data = yf.download(
            symbol, start=date, end=end_date, interval=interval, progress=False)
        stock_data = get_sma_data(stock_data)
        stock_data = get_stock_volume(stock_data)

        return stock_data

    def get_sma_data(stock_data):
        stock_data['Sma'] = stock_data['Close'].rolling(window=width).mean()
        stock_data['Std'] = stock_data['Close'].rolling(window=width).std()
        stock_data['Upper'] = stock_data['Sma'] + (stock_data['Std'] * 2)
        stock_data['Lower'] = stock_data['Sma'] - (stock_data['Std'] * 2)
        # print(stock_data)
        return stock_data

    def get_stock_volume(stock_data):
        stock_data['Volume'] = stock_data['Volume'].fillna(0)

        return stock_data

    def stock_data_to_json(stock_data, interval):
        stock_data = stock_data.drop(columns=['Adj Close', 'Std'])
        stock_data = stock_data.iloc[width:]
        json_data = stock_data.reset_index().to_dict(orient='records')
        index_name = 'Date' if 'Date' in stock_data.index.names else 'Datetime'

        for record in json_data:
            if interval == '1m' or interval == '5m':
                record[index_name] = record[index_name].strftime(
                    '%Y-%m-%d %H:%M')
            else:
                record[index_name] = record[index_name].strftime('%Y-%m-%d')

        return json_data

    stock_data_list = []

    max_retries = 5
    retries = 0
    data_downloaded = False

    while retries < max_retries and not data_downloaded:
        start_date_1 = end_date - timedelta(days=1+retries)
        stock_data = yf_donwload_data(start_date_1, '1m')

        if not stock_data.empty:
            stock_data_list.append(stock_data_to_json(stock_data, '1m'))
            data_downloaded = True
        else:
            retries += 1

    if not data_downloaded:
        print(
            f"Failed to download data for {symbol} after {max_retries} retries.")
    else:
        print(retries)

    start_date = end_date - timedelta(days=60+width)
    stockdata = yf_donwload_data(start_date, '1d')
    stock_data_list.append(stock_data_to_json(stockdata, '1d'))

    start_date = end_date - timedelta(days=180+width)
    stockdata = yf_donwload_data(start_date, '1d')
    stock_data_list.append(stock_data_to_json(stockdata, '1d'))

    start_date = end_date - timedelta(days=365+width)
    stockdata = yf_donwload_data(start_date, '1d')
    stock_data_list.append(stock_data_to_json(stockdata, '1d'))

    start_date = end_date - timedelta(days=365 * 5+width)
    stockdata = yf_donwload_data(start_date, '5d')
    stock_data_list.append(stock_data_to_json(stockdata, '5d'))

    return JsonResponse(stock_data_list, safe=False)
