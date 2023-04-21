from django.urls import path
from detail_info import views

urlpatterns = [
    path('<str:symbol>/', views.fetch_stock_detail_info, name='stock-detail-info'),
]
