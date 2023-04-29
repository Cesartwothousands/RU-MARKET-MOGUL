from django.urls import path
from protfolio import views

urlpatterns = [
    path('', views.PortfolioView.as_view(), name='portfolio'),
    path('table', views.PortfolioTable.as_view(), name='portfolio-table'),
    path('allportfolios', views.AllPortfolioTable.all_users_portfolio,
         name='allportfolios')
]
