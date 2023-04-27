from rest_framework import serializers
from .models import PurchasedStock


class PurchasedStockSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = PurchasedStock
        fields = ('id', 'username', 'stock_symbol', 'share')


class UserInfoStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchasedStock
        fields = ('stock_symbol', 'share')


class UserInfoSerializer(serializers.Serializer):
    name = serializers.CharField()
    cash = serializers.DecimalField(max_digits=10, decimal_places=2)
    stocks = UserInfoStockSerializer(many=True)
