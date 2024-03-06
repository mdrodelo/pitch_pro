from django.urls import path
from . import views

urlpatterns = [
    path('heatmap/', views.Heatmap.as_view(), name='heatmap'),
]
