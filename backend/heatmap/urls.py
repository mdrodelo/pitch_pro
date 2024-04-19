from django.urls import path
from . import views

urlpatterns = [
    path('heatmap', views.Heatmap.as_view(), name='heatmap'),
    path('NewGame', views.NewGameData.as_view(), name='newgame'),
    path('gamedata', views.AllGameData.as_view(), name='allgames'),
    path('HeatmapsByHalves', views.HeatmapsByHalves.as_view(), name='heatmapsbyhalves'),
]
