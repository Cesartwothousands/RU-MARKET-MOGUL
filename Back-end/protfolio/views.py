from django.shortcuts import render

# Create your views here.
from property.models import PurchasedStock
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from concurrent.futures import ThreadPoolExecutor
import yfinance as yf
from decimal import Decimal


class PortfolioView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def fetch_stock_info(self, stock):
        stock_info = yf.Ticker(stock.stock_symbol).info

        current_price = round(yf.Ticker(stock.stock_symbol).history(
            period='1d').iloc[0]['Close'], 2)

        previous_close = round(stock_info['previousClose'], 2)
        price_change = round(current_price - previous_close, 2)
        if previous_close:
            price_change_percent = (price_change / previous_close)
        else:
            0

        value = round(Decimal(current_price), 2)*stock.share
        change = Decimal(price_change_percent)

        return {
            'symbol': stock.stock_symbol,
            'value': value,
            'change': change
        }

    def get(self, request):
        user = request.user
        cash = user.cash

        stocks = PurchasedStock.objects.filter(
            user=user)

        with ThreadPoolExecutor() as executor:
            results = list(executor.map(self.fetch_stock_info, stocks))

        results.append({
            'name': 'Cash',
            'value': cash,
            'change': 0
        })

        return Response(results, status=status.HTTP_200_OK)


class PortfolioTable(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def fetch_stockinfo(self, stock):
        stock_info = yf.Ticker(stock.stock_symbol).info

        current_price = round(yf.Ticker(stock.stock_symbol).history(
            period='1d').iloc[0]['Close'], 2)

        previous_close = round(stock_info['previousClose'], 2)
        price_change = round(current_price - previous_close, 2)
        if previous_close:
            price_change_percent = (price_change / previous_close) * 100
        else:
            0

        value = round(Decimal(current_price), 2)*stock.share
        change = round(Decimal(price_change_percent), 2)
        price_change = round(Decimal(price_change), 2)

        if ('-USD' in stock.stock_symbol):
            sector = 'Crypto'
        else:
            sector = stock_info['sector']

        return {
            'symbol': stock.stock_symbol,
            'value': value,
            'price': current_price,
            'change': change,
            'price_change': price_change,
            'sector': sector,
            'share': stock.share
        }

    def get(self, request):
        user = request.user
        cash = user.cash

        stocks = PurchasedStock.objects.filter(
            user=user)

        with ThreadPoolExecutor() as executor:
            results = list(executor.map(self.fetch_stockinfo, stocks))

        print(results)
        return Response(results, status=status.HTTP_200_OK)
