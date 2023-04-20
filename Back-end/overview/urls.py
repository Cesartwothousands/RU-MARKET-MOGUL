from django.urls import path
from overview import views

from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.fetch_stock_table, name='fetch_stock_table'),
]
