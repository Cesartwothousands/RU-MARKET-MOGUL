from django.shortcuts import render
from django.http import JsonResponse
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from .rate_limiter import rate_limiter


def fetch_stock_table_advanced(request):
    """
    Advanced version using the rate limiter with caching
    """
    symbols = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'BRK-B', 'UNH', 'NVDA', 'XOM', 'V', 'JPM', 'TSLA', 'WMT', 'TSM', 'LVMUY', 'PG', 'CVX', 'MA', 'HD', 'TCEHY', 'NSRGF', 'NSRGY', 'ABBV', 'KO', 'RHHBY', 'PEP', 'COST', 'ORCL', 'BABA', 'ASML', 'TMO', 'AZN', 'CSCO', 'DHR', 'MCD', 'NVS', 'TM', 'LRLCY', 'IDCBY', 'TMUS', 'CRM', 'ACN', 'NEE', 'VZ',
               'PROSY', 'LIN', 'BHP', 'PM', 'CICHY', 'DIS', 'BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'USDC-USD', 'XRP-USD', 'ADA-USD', 'HEX-USD', 'DOGE-USD', 'STETH-USD', 'MATIC-USD', 'SOL-USD', 'DOT-USD', 'BUSD-USD', 'LTC-USD', 'WTRX-USD', 'SHIB-USD', 'AVAX-USD', 'TRX-USD', 'DAI-USD', 'WBTC-USD', 'LINK-USD', 'TMG-USD', 'UNI7083-USD', 'LEO-USD']

    data = []
    failed_symbols = []

    # Process symbols with controlled concurrency
    with ThreadPoolExecutor(max_workers=3) as executor:  # Very conservative concurrency
        futures = [executor.submit(rate_limiter.fetch_stock_data, symbol) for symbol in symbols]
        
        for future in as_completed(futures):
            try:
                result = future.result()
                if result:
                    data.append(result)
                else:
                    failed_symbols.append('Unknown')
            except Exception as e:
                print(f"Error processing symbol: {e}")
                continue

    # Log failed symbols for debugging
    if failed_symbols:
        print(f"Failed to fetch data for {len(failed_symbols)} symbols")

    # Convert the data to JSON
    json_data = json.dumps(data)
    return JsonResponse(json_data, safe=False)


def fetch_stock_table_sequential(request):
    """
    Sequential version for maximum reliability (no concurrency)
    """
    symbols = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'BRK-B', 'UNH', 'NVDA', 'XOM', 'V', 'JPM', 'TSLA', 'WMT', 'TSM', 'LVMUY', 'PG', 'CVX', 'MA', 'HD', 'TCEHY', 'NSRGF', 'NSRGY', 'ABBV', 'KO', 'RHHBY', 'PEP', 'COST', 'ORCL', 'BABA', 'ASML', 'TMO', 'AZN', 'CSCO', 'DHR', 'MCD', 'NVS', 'TM', 'LRLCY', 'IDCBY', 'TMUS', 'CRM', 'ACN', 'NEE', 'VZ',
               'PROSY', 'LIN', 'BHP', 'PM', 'CICHY', 'DIS', 'BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'USDC-USD', 'XRP-USD', 'ADA-USD', 'HEX-USD', 'DOGE-USD', 'STETH-USD', 'MATIC-USD', 'SOL-USD', 'DOT-USD', 'BUSD-USD', 'LTC-USD', 'WTRX-USD', 'SHIB-USD', 'AVAX-USD', 'TRX-USD', 'DAI-USD', 'WBTC-USD', 'LINK-USD', 'TMG-USD', 'UNI7083-USD', 'LEO-USD']

    data = []
    failed_symbols = []

    for symbol in symbols:
        try:
            result = rate_limiter.fetch_stock_data(symbol)
            if result:
                data.append(result)
            else:
                failed_symbols.append(symbol)
        except Exception as e:
            print(f"Error processing {symbol}: {e}")
            failed_symbols.append(symbol)

    # Log failed symbols for debugging
    if failed_symbols:
        print(f"Failed to fetch data for symbols: {failed_symbols}")

    # Convert the data to JSON
    json_data = json.dumps(data)
    return JsonResponse(json_data, safe=False)
