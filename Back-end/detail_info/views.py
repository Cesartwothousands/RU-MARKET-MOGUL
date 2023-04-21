from django.shortcuts import render

# Create your views here.
import json
import yfinance as yf
from django.http import JsonResponse


def fetch_stock_detail_info(request, symbol):
    data = []
    symbol = symbol.upper()

    try:
        stock_info = yf.Ticker(symbol).info
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return JsonResponse(data, safe=False)

    def fetch(param):
        return stock_info.get(param, '')

    current_price = round(yf.Ticker(symbol).history(
        period='1d').iloc[0]['Close'], 2)

    previous_close = round(fetch('previousClose'), 2)
    price_change = round(current_price - previous_close, 2)
    price_change_percent = round(
        (price_change / previous_close) * 100, 2) if previous_close else 0

    data.append({
        'symbol': fetch('symbol'),
        'shortname': fetch('shortName'),  # Crypto only
        'longname': fetch('longName'),  # Stocks only
        'sector': fetch('sector'),  # Stocks only
        'current_price': current_price,
        'previous_close': previous_close,
        'open': fetch('open'),
        'day_low': fetch('dayLow'),
        'day_high': fetch('dayHigh'),
        'year_low': fetch('fiftyTwoWeekLow'),
        'year_high': fetch('fiftyTwoWeekHigh'),
        'volume': fetch('volume'),
        'marketCap': fetch('marketCap'),
        'averageVolume': fetch('averageVolume'),
        'targetHighPrice': fetch('targetHighPrice'),  # Stocks only
        'targetLowPrice': fetch('targetLowPrice'),  # Stocks only
        'targetMedianPrice': fetch('targetMedianPrice'),  # Stocks only
        'recommendationMean':  fetch('recommendationMean'),  # Stocks only
        'recommendationKey':  fetch('recommendationKey'),  # Stocks only
        'website': fetch('website'),  # Stocks only
        'twitter': fetch('twitter'),  # Crypto only
        'price_change': price_change,
        'price_change_percent': price_change_percent,
        'start_date': fetch('startDate'),  # Crypto only
    })

    # Convert the data to JSON
    json_data = json.dumps(data)

    return JsonResponse(json_data, safe=False)


'''
[{'symbol': 'A',
  'shortname': 'Agilent Technologies, Inc.',
  'longname': 'Agilent Technologies, Inc.',
  'sector': 'Healthcare',
  'current_price': 138.93,
  'previous_close': 139.0,
  'open': 138.37,
  'day_low': 137.68,
  'day_high': 139.615,
  'year_low': 112.52,
  'year_high': 160.26,
  'volume': 1147661,
  'marketCap': 41081880576,
  'averageVolume': 1401244,
  'targetHighPrice': 174.0,
  'targetLowPrice': 145.0,
  'targetMedianPrice': 168.0,
  'recommendationMean': 1.9,
  'recommendationKey': 'buy',
  'website': 'https://www.agilent.com',
  'twitter': '',
  'price_change': -0.07,
  'price_change_percent': -0.05,
  'start_date': ''}]
  
[{'symbol': 'BTC-USD',
  'shortname': 'Bitcoin USD',
  'longname': 'Bitcoin USD',
  'sector': '',
  'current_price': 28870.37,
  'previous_close': 28809.23,
  'open': 28809.229,
  'day_low': 28668.95,
  'day_high': 29076.4,
  'year_low': 15599.047,
  'year_high': 42893.582,
  'volume': 20739614720,
  'marketCap': 558683848704,
  'averageVolume': 24700469947,
  'targetHighPrice': '',
  'targetLowPrice': '',
  'targetMedianPrice': '',
  'recommendationMean': '',
  'recommendationKey': '',
  'website': '',
  'twitter': '',
  'price_change': 61.14,
  'price_change_percent': 0.21,
  'start_date': '2010-07-13'}]
'''
