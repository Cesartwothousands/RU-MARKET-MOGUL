"""
URL configuration for RUMM_Backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('overview/', include('overview.urls')),
    path('detail/', include('detail_info.urls')),
    path('detailgraph/', include('detail_graph.urls')),
    path('predictions/', include('predictions.urls')),
    path('webreg/', include('webreg.urls')),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('property/', include('property.urls')),
    path('portfolio/', include('protfolio.urls')),
]
