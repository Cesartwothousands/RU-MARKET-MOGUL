from django.urls import path
from detail_graph import views

urlpatterns = [
    path('<str:symbol>/', views.fetch_stock_detail_graph,
         name='stock-detail-graph'),
]
