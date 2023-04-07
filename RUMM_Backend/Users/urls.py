from django.urls import re_path
from Users import views

urlpatterns = [
    re_path(r'^department/$', views.departmentApi),
    re_path(r'^department/([0-9]+)$', views.departmentApi),

    re_path(r'^user/$', views.userApi),
    re_path(r'^user/([0-9]+)$', views.userApi),
]
