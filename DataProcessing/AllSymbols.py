import sqlite3
import yfinance as yf


def read_symbols_from_file(filename):
    with open(filename, 'r') as f:
        symbols = f.readlines()
    return [s.strip() for s in symbols]


def process_stock_symbols(stock_symbols, cursor):
    for symbol in stock_symbols:
        try:
            stock_info = yf.Ticker(symbol).info
            short_name = stock_info.get('shortName', '')
            long_name = stock_info.get('longName', '')
            cursor.execute(
                "INSERT OR IGNORE INTO Stocks (symbol, short_name, long_name) VALUES (?, ?, ?)", (symbol, short_name, long_name))
            print(f"Added {symbol} to the database.")
        except Exception as e:
            print(f"Error processing {symbol}: {e}")


def process_crypto_symbols(crypto_symbols, cursor):
    for symbol in crypto_symbols:
        try:
            crypto_symbol = f"{symbol}-USD"
            crypto_info = yf.Ticker(crypto_symbol).info
            short_name = crypto_info.get('shortName', '')
            long_name = crypto_info.get('longName', '')
            cursor.execute(
                "INSERT OR IGNORE INTO Crypto (symbol, short_name, long_name) VALUES (?, ?, ?)", (crypto_symbol, short_name, long_name))
            print(f"Added {crypto_symbol} to the database.")
        except Exception as e:
            print(f"Error processing {symbol}: {e}")


if __name__ == "__main__":
    stock_symbols_file = 'Back-end\AllStocks.txt'
    crypto_symbols_file = 'Back-end\AllCrypto.txt'

    stock_symbols = read_symbols_from_file(stock_symbols_file)
    crypto_symbols = read_symbols_from_file(crypto_symbols_file)

    connection = sqlite3.connect('Back-end\db.sqlite3')
    cursor = connection.cursor()

    process_stock_symbols(stock_symbols, cursor)
    process_crypto_symbols(crypto_symbols, cursor)

    connection.commit()
    connection.close()
