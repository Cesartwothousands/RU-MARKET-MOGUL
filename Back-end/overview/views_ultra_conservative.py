from django.shortcuts import render
from django.http import JsonResponse
import json
import time
import random
import yfinance as yf
from requests.exceptions import HTTPError, RequestException


def fetch_stock_table_ultra_conservative(request):
    """
    Ultra-conservative version that processes symbols one at a time
    with very long delays to ensure no rate limiting
    """
    symbols = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'BRK-B', 'UNH', 'NVDA', 'XOM', 'V', 'JPM', 'TSLA', 'WMT', 'TSM', 'LVMUY', 'PG', 'CVX', 'MA', 'HD', 'TCEHY', 'NSRGF', 'NSRGY', 'ABBV', 'KO', 'RHHBY', 'PEP', 'COST', 'ORCL', 'BABA', 'ASML', 'TMO', 'AZN', 'CSCO', 'DHR', 'MCD', 'NVS', 'TM', 'LRLCY', 'IDCBY', 'TMUS', 'CRM', 'ACN', 'NEE', 'VZ',
               'PROSY', 'LIN', 'BHP', 'PM', 'CICHY', 'DIS', 'BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'USDC-USD', 'XRP-USD', 'ADA-USD', 'HEX-USD', 'DOGE-USD', 'STETH-USD', 'MATIC-USD', 'SOL-USD', 'DOT-USD', 'BUSD-USD', 'LTC-USD', 'WTRX-USD', 'SHIB-USD', 'AVAX-USD', 'TRX-USD', 'DAI-USD', 'WBTC-USD', 'LINK-USD', 'TMG-USD', 'UNI7083-USD', 'LEO-USD']

    data = []
    failed_symbols = []
    
    print(f"Starting ultra-conservative fetch of {len(symbols)} symbols...")
    print("This will take approximately 2-3 minutes to complete.")
    
    start_time = time.time()
    
    for i, symbol in enumerate(symbols):
        try:
            print(f"\n[{i+1:2d}/{len(symbols)}] Processing {symbol}...")
            
            # Fetch data with aggressive retry logic
            result = fetch_data_ultra_safe(symbol)
            
            if result:
                data.append(result)
                print(f"✓ {symbol}: ${result['lastprice']} ({result['change2']}%)")
            else:
                failed_symbols.append(symbol)
                print(f"✗ {symbol}: Failed to fetch data")
            
            # Ultra-conservative delay: 3-5 seconds between requests
            if i < len(symbols) - 1:
                delay = random.uniform(3.0, 5.0)
                print(f"Waiting {delay:.1f}s before next request...")
                time.sleep(delay)
                
        except Exception as e:
            print(f"✗ Error processing {symbol}: {e}")
            failed_symbols.append(symbol)
            continue

    end_time = time.time()
    total_time = end_time - start_time
    
    print(f"\n{'='*50}")
    print(f"Fetch completed in {total_time:.1f} seconds")
    print(f"Successfully fetched: {len(data)} symbols")
    print(f"Failed: {len(failed_symbols)} symbols")
    
    if failed_symbols:
        print(f"Failed symbols: {failed_symbols}")
    else:
        print("🎉 All symbols fetched successfully!")
    
    print(f"{'='*50}")

    # Convert the data to JSON
    json_data = json.dumps(data)
    return JsonResponse(json_data, safe=False)


def fetch_data_ultra_safe(symbol, max_retries=5):
    """
    Ultra-safe data fetching with aggressive retry logic
    """
    for attempt in range(max_retries):
        try:
            # Small delay before each attempt
            time.sleep(random.uniform(0.2, 0.5))
            
            result = fetch_single_stock_data(symbol)
            if result:
                return result
                
        except HTTPError as e:
            if e.response.status_code == 429:  # Too Many Requests
                # Very long delays for rate limits
                wait_time = (3 ** attempt) + random.uniform(5, 15)
                print(f"  ⚠️  Rate limited for {symbol}, waiting {wait_time:.1f}s before retry {attempt + 1}")
                time.sleep(wait_time)
                continue
            else:
                print(f"  ✗ HTTP error for {symbol}: {e}")
                return None
                
        except RequestException as e:
            print(f"  ✗ Request error for {symbol}: {e}")
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.uniform(2, 8)
                time.sleep(wait_time)
                continue
            return None
            
        except Exception as e:
            print(f"  ✗ Unexpected error for {symbol}: {e}")
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.uniform(1, 5)
                time.sleep(wait_time)
                continue
            return None
    
    print(f"  ✗ Failed to fetch {symbol} after {max_retries} attempts")
    return None


def fetch_single_stock_data(symbol):
    """Fetch data for a single stock symbol"""
    try:
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

        return {
            'symbol': symbol,
            'name': name,
            'sector': sector,
            'lastprice': last_price,
            'change1': price_change,
            'change2': price_change_percent,
            'volume': volume,
            'marketcap': marketcap
        }
        
    except Exception as e:
        print(f"  ✗ Error fetching data for {symbol}: {e}")
        return None


def fetch_stock_table_mini_batch(request):
    """
    Mini-batch version that processes symbols in groups of 3 with delays
    """
    symbols = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'BRK-B', 'UNH', 'NVDA', 'XOM', 'V', 'JPM', 'TSLA', 'WMT', 'TSM', 'LVMUY', 'PG', 'CVX', 'MA', 'HD', 'TCEHY', 'NSRGF', 'NSRGY', 'ABBV', 'KO', 'RHHBY', 'PEP', 'COST', 'ORCL', 'BABA', 'ASML', 'TMO', 'AZN', 'CSCO', 'DHR', 'MCD', 'NVS', 'TM', 'LRLCY', 'IDCBY', 'TMUS', 'CRM', 'ACN', 'NEE', 'VZ',
               'PROSY', 'LIN', 'BHP', 'PM', 'CICHY', 'DIS', 'BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'USDC-USD', 'XRP-USD', 'ADA-USD', 'HEX-USD', 'DOGE-USD', 'STETH-USD', 'MATIC-USD', 'SOL-USD', 'DOT-USD', 'BUSD-USD', 'LTC-USD', 'WTRX-USD', 'SHIB-USD', 'AVAX-USD', 'TRX-USD', 'DAI-USD', 'WBTC-USD', 'LINK-USD', 'TMG-USD', 'UNI7083-USD', 'LEO-USD']

    data = []
    failed_symbols = []
    
    # Process in mini-batches of 3 symbols
    batch_size = 3
    delay_between_batches = 8  # 8 seconds between batches
    
    print(f"Starting mini-batch fetch of {len(symbols)} symbols...")
    print(f"Processing in batches of {batch_size} with {delay_between_batches}s delays")
    
    for i in range(0, len(symbols), batch_size):
        batch = symbols[i:i + batch_size]
        print(f"\n--- Processing batch {i//batch_size + 1}: {batch} ---")
        
        for j, symbol in enumerate(batch):
            try:
                print(f"  [{j+1}/{len(batch)}] Fetching {symbol}...")
                result = fetch_data_ultra_safe(symbol)
                
                if result:
                    data.append(result)
                    print(f"  ✓ {symbol}: ${result['lastprice']} ({result['change2']}%)")
                else:
                    failed_symbols.append(symbol)
                    print(f"  ✗ {symbol}: Failed")
                
                # Small delay between symbols in the same batch
                if j < len(batch) - 1:
                    time.sleep(random.uniform(1.0, 2.0))
                    
            except Exception as e:
                print(f"  ✗ Error processing {symbol}: {e}")
                failed_symbols.append(symbol)
                continue
        
        # Delay between batches
        if i + batch_size < len(symbols):
            print(f"Waiting {delay_between_batches}s before next batch...")
            time.sleep(delay_between_batches)
    
    print(f"\n{'='*50}")
    print(f"Mini-batch fetch completed!")
    print(f"Successfully fetched: {len(data)} symbols")
    print(f"Failed: {len(failed_symbols)} symbols")
    
    if failed_symbols:
        print(f"Failed symbols: {failed_symbols}")
    
    print(f"{'='*50}")

    # Convert the data to JSON
    json_data = json.dumps(data)
    return JsonResponse(json_data, safe=False)
