from django.urls import path
from . import views
from display.views import inicio

urlpatterns = [
    path('', views.inicio, name='inicio'),    
]