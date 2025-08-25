# Overview App - Rate Limiting Solution

This app provides multiple solutions to handle Yahoo Finance API rate limiting (429 Too Many Requests errors).

## Problem
The original implementation was making 100 concurrent requests to Yahoo Finance, which triggered their rate limiting and caused 429 errors.

## Solutions

### 1. Basic Rate Limiting (`/overview/`)
- **File**: `views.py`
- **Features**:
  - Reduced concurrency from 100 to 5 workers
  - Batch processing with delays between batches
  - Retry logic with exponential backoff
  - Better error handling

### 2. Advanced Rate Limiting (`/overview/advanced/`)
- **File**: `views_advanced.py` + `rate_limiter.py`
- **Features**:
  - Intelligent rate limiting (60 requests/minute, 1000/hour)
  - Data caching (5-minute cache)
  - Conservative concurrency (3 workers)
  - Automatic retry with exponential backoff

### 3. Sequential Processing (`/overview/sequential/`)
- **File**: `views_advanced.py`
- **Features**:
  - No concurrency (maximum reliability)
  - Uses the same rate limiter and caching
  - Slower but most reliable

## Configuration

Edit `config.py` to adjust:
- Rate limits
- Cache duration
- Concurrency settings
- Error handling behavior

## Usage

### Frontend Integration
Update your frontend to use one of these endpoints:

```javascript
// Basic rate limiting
fetch('/overview/')

// Advanced rate limiting with caching
fetch('/overview/advanced/')

// Sequential processing (most reliable)
fetch('/overview/sequential/')
```

### Testing
1. Start with `/overview/sequential/` for maximum reliability
2. If performance is acceptable, try `/overview/advanced/`
3. Use `/overview/` for balanced performance/reliability

## Monitoring

The system logs:
- Rate limit violations
- Failed symbol fetches
- Cache hits/misses
- Retry attempts

Check your Django console for these logs.

## Troubleshooting

### Still getting 429 errors?
1. Increase delays in `config.py`
2. Reduce `max_requests_per_minute`
3. Use the sequential endpoint

### Performance too slow?
1. Increase `batch_size`
2. Reduce `delay_between_batches`
3. Increase worker count (cautiously)

## Cache Management

Stock data is cached for 5 minutes by default. The cache file (`stock_data_cache.json`) is automatically managed.

## Best Practices

1. **Start conservative**: Begin with sequential processing
2. **Monitor logs**: Watch for rate limit violations
3. **Adjust gradually**: Make small changes to rate limiting settings
4. **Test thoroughly**: Verify changes don't trigger rate limits
5. **Use caching**: Leverage the built-in caching for repeated requests
