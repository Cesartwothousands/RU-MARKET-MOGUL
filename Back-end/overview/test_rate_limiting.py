#!/usr/bin/env python3
"""
Test script for rate limiting functionality
Run this to test the rate limiter without starting the full Django server
"""

import sys
import os
import time

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from overview.rate_limiter import RateLimiter


def test_rate_limiter():
    """Test the rate limiter with a few symbols"""
    print("Testing Rate Limiter...")
    
    # Create a rate limiter instance
    limiter = RateLimiter(max_requests_per_minute=10, max_requests_per_hour=50)
    
    # Test symbols (small list for testing)
    test_symbols = ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'AMZN']
    
    print(f"Testing with {len(test_symbols)} symbols...")
    print("Rate limit: 10 requests/minute, 50 requests/hour")
    print("-" * 50)
    
    start_time = time.time()
    
    for i, symbol in enumerate(test_symbols, 1):
        print(f"Fetching {symbol} ({i}/{len(test_symbols)})...")
        
        try:
            result = limiter.fetch_stock_data(symbol)
            if result:
                print(f"✓ {symbol}: ${result['lastprice']} ({result['change2']}%)")
            else:
                print(f"✗ {symbol}: Failed to fetch data")
        except Exception as e:
            print(f"✗ {symbol}: Error - {e}")
        
        # Small delay between requests
        if i < len(test_symbols):
            time.sleep(1)
    
    end_time = time.time()
    total_time = end_time - start_time
    
    print("-" * 50)
    print(f"Total time: {total_time:.2f} seconds")
    print(f"Average time per request: {total_time/len(test_symbols):.2f} seconds")
    print("Test completed!")


def test_concurrent_requests():
    """Test concurrent requests to see rate limiting in action"""
    print("\nTesting Concurrent Requests...")
    
    from concurrent.futures import ThreadPoolExecutor, as_completed
    
    limiter = RateLimiter(max_requests_per_minute=5, max_requests_per_hour=20)
    test_symbols = ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX']
    
    print(f"Testing {len(test_symbols)} concurrent requests...")
    print("Rate limit: 5 requests/minute, 20 requests/hour")
    print("-" * 50)
    
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = [executor.submit(limiter.fetch_stock_data, symbol) for symbol in test_symbols]
        
        for i, future in enumerate(as_completed(futures), 1):
            try:
                result = future.result()
                if result:
                    print(f"✓ {result['symbol']}: ${result['lastprice']} ({result['change2']}%)")
                else:
                    print(f"✗ Request {i}: Failed to fetch data")
            except Exception as e:
                print(f"✗ Request {i}: Error - {e}")
    
    end_time = time.time()
    total_time = end_time - start_time
    
    print("-" * 50)
    print(f"Total time: {total_time:.2f} seconds")
    print(f"Average time per request: {total_time/len(test_symbols):.2f} seconds")
    print("Concurrent test completed!")


if __name__ == "__main__":
    print("Rate Limiting Test Suite")
    print("=" * 50)
    
    try:
        test_rate_limiter()
        test_concurrent_requests()
        
        print("\n" + "=" * 50)
        print("All tests completed successfully!")
        print("\nIf you see rate limiting delays, the system is working correctly.")
        print("Check the console output for timing information.")
        
    except KeyboardInterrupt:
        print("\nTest interrupted by user")
    except Exception as e:
        print(f"\nTest failed with error: {e}")
        import traceback
        traceback.print_exc()
