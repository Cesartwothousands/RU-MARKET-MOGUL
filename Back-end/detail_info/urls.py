from django.urls import path
from detail_info import views

urlpatterns = [
    path('', views.fetch_stock_detail_info,
         name='fetch_stock_detail_info'),
    path('<str:symbol>/', views.fetch_stock_detail_info, name='stock-detail'),
]
