from django.urls import path
from protfolio import views

urlpatterns = [
    path('', views.PortfolioView.as_view(), name='portfolio'),
]
