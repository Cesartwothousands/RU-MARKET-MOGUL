"""
Configuration settings for the overview app
"""

# Rate limiting configuration
RATE_LIMIT_CONFIG = {
    'max_requests_per_minute': 60,  # Yahoo Finance allows ~60 requests per minute
    'max_requests_per_hour': 1000,  # Conservative hourly limit
    'cache_duration_minutes': 5,    # How long to cache stock data
    'retry_attempts': 3,            # Number of retry attempts for failed requests
    'delay_between_requests': 1.0,  # Minimum delay between requests in seconds
    'batch_size': 10,               # Process symbols in batches of this size
    'delay_between_batches': 2.0,   # Delay between batches in seconds
}

# Stock symbols configuration
STOCK_SYMBOLS = [
    'AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'BRK-B', 'UNH', 'NVDA', 'XOM', 'V', 
    'JPM', 'TSLA', 'WMT', 'TSM', 'LVMUY', 'PG', 'CVX', 'MA', 'HD', 'TCEHY', 
    'NSRGF', 'NSRGY', 'ABBV', 'KO', 'RHHBY', 'PEP', 'COST', 'ORCL', 'BABA', 
    'ASML', 'TMO', 'AZN', 'CSCO', 'DHR', 'MCD', 'NVS', 'TM', 'LRLCY', 'IDCBY', 
    'TMUS', 'CRM', 'ACN', 'NEE', 'VZ', 'PROSY', 'LIN', 'BHP', 'PM', 'CICHY', 
    'DIS', 'BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'USDC-USD', 'XRP-USD', 
    'ADA-USD', 'HEX-USD', 'DOGE-USD', 'STETH-USD', 'MATIC-USD', 'SOL-USD', 
    'DOT-USD', 'BUSD-USD', 'LTC-USD', 'WTRX-USD', 'SHIB-USD', 'AVAX-USD', 
    'TRX-USD', 'DAI-USD', 'WBTC-USD', 'LINK-USD', 'TMG-USD', 'UNI7083-USD', 'LEO-USD'
]

# Concurrency settings
CONCURRENCY_CONFIG = {
    'default_workers': 5,           # Default number of worker threads
    'conservative_workers': 3,      # Conservative number for rate-limited scenarios
    'sequential_workers': 1,        # Sequential processing (no concurrency)
}

# Error handling configuration
ERROR_CONFIG = {
    'log_failures': True,           # Whether to log failed symbol fetches
    'continue_on_error': True,      # Whether to continue processing on individual failures
    'max_consecutive_failures': 10, # Maximum consecutive failures before stopping
}
