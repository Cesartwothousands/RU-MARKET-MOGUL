from django.shortcuts import render

# Create your views here.

import json
import pandas as pd
import yfinance as yf
from concurrent.futures import ThreadPoolExecutor
from django.http import JsonResponse


def fetch_stock_table(request):
    symbols = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'BRK-B', 'UNH', 'NVDA', 'XOM', 'V', 'JPM', 'TSLA', 'WMT', 'TSM', 'LVMUY', 'PG', 'CVX', 'MA', 'HD', 'TCEHY', 'NSRGF', 'NSRGY', 'ABBV', 'KO', 'RHHBY', 'PEP', 'COST', 'ORCL', 'BABA', 'ASML', 'TMO', 'AZN', 'CSCO', 'DHR', 'MCD', 'NVS', 'TM', 'LRLCY', 'IDCBY', 'TMUS', 'CRM', 'ACN', 'NEE', 'VZ',
               'PROSY', 'LIN', 'BHP', 'PM', 'CICHY', 'DIS', 'BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'USDC-USD', 'XRP-USD', 'ADA-USD', 'HEX-USD', 'DOGE-USD', 'STETH-USD', 'MATIC-USD', 'SOL-USD', 'DOT-USD', 'BUSD-USD', 'LTC-USD', 'WTRX-USD', 'SHIB-USD', 'AVAX-USD', 'TRX-USD', 'DAI-USD', 'WBTC-USD', 'LINK-USD', 'TMG-USD', 'UNI7083-USD', 'LEO-USD']

    # The fetch_data function from your initial code goes here

    data = []

    with ThreadPoolExecutor(max_workers=100) as executor:
        futures = [executor.submit(fetch_data, symbol) for symbol in symbols]
        for future in futures:
            data.append(future.result())

    # Convert the data to JSON
    json_data = json.dumps(data)

    return JsonResponse(json_data, safe=False)


# Define a function to fetch the data for a given symbol
def fetch_data(symbol):
    stock_info = yf.Ticker(symbol).info

    if '-USD' in symbol:
        last_price = round(yf.Ticker(symbol).history(
            period='1d').iloc[0]['Close'], 2)
        sector = 'Crypto'
    else:
        last_price = round(stock_info['currentPrice'], 2)
        sector = stock_info['sector']

    previous_close = round(stock_info['previousClose'], 2)

    # Calculate price change in absolute and percentage terms
    price_change = round(last_price - previous_close, 2)
    price_change_percent = round(
        (price_change / previous_close) * 100, 2) if previous_close else 0

    volume = round(stock_info['regularMarketVolume'], 2)

    marketcap = round(stock_info['marketCap'], 2)

    if (symbol == 'MATIC-USD' or 'BUSD-USD'):
        name = stock_info['shortName']
    else:
        name = stock_info['longName']

    return ({
        'symbol': symbol,
        'name': name,
        'sector': sector,
        'lastprice': last_price,
        'change1': price_change,
        'change2': price_change_percent,
        'volume': volume,
        'marketcap': marketcap
    })
