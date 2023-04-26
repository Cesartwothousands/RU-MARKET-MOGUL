from django.urls import path
from predictions import views

urlpatterns = [
    path('<str:symbol>/', views.fetch_stock_prediction, name='stock-prediction'),
]
