import time
import random
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import yfinance as yf
from requests.exceptions import HTTPError, RequestException


class RateLimiter:
    """
    Advanced rate limiter for Yahoo Finance API calls
    """
    
    def __init__(self, max_requests_per_minute=60, max_requests_per_hour=1000):
        self.max_requests_per_minute = max_requests_per_minute
        self.max_requests_per_hour = max_requests_per_hour
        self.request_times = []
        self.cache_file = "stock_data_cache.json"
        self.cache_duration = timedelta(minutes=5)  # Cache data for 5 minutes
        
    def _cleanup_old_requests(self):
        """Remove old request timestamps"""
        current_time = time.time()
        self.request_times = [t for t in self.request_times if current_time - t < 3600]  # Keep last hour
        
    def _can_make_request(self) -> bool:
        """Check if we can make a request based on rate limits"""
        self._cleanup_old_requests()
        current_time = time.time()
        
        # Check minute limit
        requests_last_minute = len([t for t in self.request_times if current_time - t < 60])
        if requests_last_minute >= self.max_requests_per_minute:
            return False
            
        # Check hour limit
        if len(self.request_times) >= self.max_requests_per_hour:
            return False
            
        return True
        
    def _wait_for_rate_limit(self):
        """Wait until we can make a request"""
        while not self._can_make_request():
            wait_time = random.uniform(1, 3)
            time.sleep(wait_time)
            
    def _record_request(self):
        """Record the time of this request"""
        self.request_times.append(time.time())
        
    def _get_cache_key(self, symbol: str) -> str:
        """Generate cache key for a symbol"""
        return f"{symbol}_{datetime.now().strftime('%Y%m%d_%H%M')}"
        
    def _load_cache(self) -> Dict[str, Any]:
        """Load cached data from file"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                pass
        return {}
        
    def _save_cache(self, cache_data: Dict[str, Any]):
        """Save data to cache file"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump(cache_data, f, indent=2)
        except IOError as e:
            print(f"Error saving cache: {e}")
            
    def _is_cache_valid(self, cache_data: Dict[str, Any], symbol: str) -> bool:
        """Check if cached data is still valid"""
        if symbol not in cache_data:
            return False
            
        cached_time = datetime.fromisoformat(cache_data[symbol]['timestamp'])
        return datetime.now() - cached_time < self.cache_duration
        
    def fetch_stock_data(self, symbol: str, max_retries: int = 3) -> Optional[Dict[str, Any]]:
        """
        Fetch stock data with rate limiting, caching, and retry logic
        """
        # Check cache first
        cache_data = self._load_cache()
        if self._is_cache_valid(cache_data, symbol):
            print(f"Using cached data for {symbol}")
            return cache_data[symbol]['data']
            
        # Wait for rate limit if necessary
        self._wait_for_rate_limit()
        
        # Try to fetch data with retries
        for attempt in range(max_retries):
            try:
                # Record this request
                self._record_request()
                
                # Add small random delay
                time.sleep(random.uniform(0.1, 0.3))
                
                # Fetch the data
                result = self._fetch_single_stock(symbol)
                
                if result:
                    # Cache the successful result
                    cache_data[symbol] = {
                        'data': result,
                        'timestamp': datetime.now().isoformat()
                    }
                    self._save_cache(cache_data)
                    return result
                    
            except HTTPError as e:
                if e.response.status_code == 429:  # Too Many Requests
                    wait_time = (2 ** attempt) + random.uniform(1, 3)
                    print(f"Rate limited for {symbol}, waiting {wait_time:.2f}s before retry {attempt + 1}")
                    time.sleep(wait_time)
                    continue
                else:
                    print(f"HTTP error for {symbol}: {e}")
                    return None
                    
            except RequestException as e:
                print(f"Request error for {symbol}: {e}")
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + random.uniform(1, 3)
                    time.sleep(wait_time)
                    continue
                return None
                
            except Exception as e:
                print(f"Unexpected error for {symbol}: {e}")
                return None
                
        print(f"Failed to fetch data for {symbol} after {max_retries} attempts")
        return None
        
    def _fetch_single_stock(self, symbol: str) -> Optional[Dict[str, Any]]:
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
            print(f"Error fetching data for {symbol}: {e}")
            return None


# Global rate limiter instance
rate_limiter = RateLimiter()
