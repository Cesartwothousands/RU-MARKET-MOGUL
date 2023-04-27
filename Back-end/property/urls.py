from django.urls import path
from property import views

urlpatterns = [
    path('buy/', views.BuyStockView.as_view(), name='buy_stock'),
    path('sell/', views.SellStockView.as_view(), name='sell_stock'),
    path('initialize_cash/', views.InitializeCashView.as_view(),
         name='initialize_cash'),
    path('user_info/', views.UserInfoView.as_view(), name='user_info')
]
