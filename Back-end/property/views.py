from django.shortcuts import render

# Create your views here.
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import PurchasedStock
from .serializers import PurchasedStockSerializer, UserInfoSerializer, UserInfoStockSerializer
from decimal import ROUND_DOWN, Decimal


class BuyStockView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        stock_symbol = request.data.get('stock_symbol')
        share = request.data.get('share')
        value = request.data.get('value')  # total value

        if stock_symbol and share and value:
            user = request.user
            total_cost = value

            if user.cash >= total_cost:
                stock, created = PurchasedStock.objects.get_or_create(
                    user=user, stock_symbol=stock_symbol, defaults={'share': 0}
                )

                if created:
                    stock.share = Decimal(share)
                else:
                    stock.share += Decimal(share)

                stock.save()

                # Convert total_cost to a Decimal object
                user.cash -= Decimal(total_cost)
                user.save()

                serializer = PurchasedStockSerializer(stock)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Insufficient cash"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class SellStockView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        stock_symbol = request.data.get('stock_symbol')
        share_to_sell = request.data.get('share')
        value = request.data.get('value')  # total value

        if stock_symbol and share_to_sell and value:
            try:
                stock = PurchasedStock.objects.get(
                    user=request.user, stock_symbol=stock_symbol)
            except PurchasedStock.DoesNotExist:
                return Response({"detail": "Stock not found"}, status=status.HTTP_404_NOT_FOUND)

            existshare = round(float(stock.share), 1)
            share_to_sell = round(float(share_to_sell), 1)
            print("Missing required fields:",
                  request.data, existshare, share_to_sell,)

            if existshare >= share_to_sell:
                existshare -= share_to_sell

                if existshare == 0:
                    stock.delete()
                else:
                    stock.save()

                user = request.user
                user.cash += Decimal(value)
                user.save()

                serializer = PurchasedStockSerializer(stock)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:

                return Response({"detail": "Insufficient shares"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class InitializeCashView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        cash = request.data.get('cash')

        if cash and 1000 <= cash <= 100000000:
            user = request.user
            user.cash = cash
            user.save()

            PurchasedStock.objects.filter(user=request.user).delete()

            return Response({"detail": "Cash initialized and stocks cleared"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid cash value. It must be between 1000 and 100000000"},
                            status=status.HTTP_400_BAD_REQUEST)


class UserInfoView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        stocks = PurchasedStock.objects.filter(user=user)
        stocks_serialized = UserInfoStockSerializer(stocks, many=True)
        user_info = {
            'name': user.username,
            'email': user.email,
            'cash': user.cash,
            'stocks': stocks_serialized.data
        }
        serializer = UserInfoSerializer(user_info)
        return Response(serializer.data, status=status.HTTP_200_OK)
