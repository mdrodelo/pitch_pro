from django.shortcuts import render
from django.db import transaction, connection
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework import permissions, status
from .serializers import GameDataSerializer, AllGameDataSerializer, HeatMapSerializer, SingleGameDataSerializer, HeartRateSerializer
from rest_framework.response import Response
import base64
import heatmap.data as GPXFunctions
import pandas as pd

from user_api.models import AppUser
from heatmap.models import GameData, PlayerMovement

# Imports that should be moved to backend
from mplsoccer import Pitch, Sbopen
import io
# end of these imports

# DO NOT REMOVE Fixes a weird NSInternalInconsistencyException
import matplotlib
matplotlib.use('Agg')


class HeatmapsByHalves(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        game_id = request.data['game_id']
        query = str(PlayerMovement.objects.all().filter(game_id=game_id).query)
        df = pd.read_sql_query(query, connection)
        game_res = GameData.objects.get(game_id=game_id)
        game_data = SingleGameDataSerializer(game_res) # contains game title, date, position
        field = game_data.data.get('field_parameters')
        heatmaps = GPXFunctions.draw_heatmap_by_halves(df, field)
        return Response({'heatmaps': heatmaps}, status=status.HTTP_200_OK)


class Heatmap(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        game_id = request.data['game_id']
        #res = PlayerMovement.objects.all().filter(game_id=game_id)
        # serialized_dataframe = pd.DataFrame(HeatMapSerializer(res, many=True))
        query = str(PlayerMovement.objects.all().filter(game_id=game_id).query)
        df = pd.read_sql_query(query, connection)
        field_res = GameData.objects.get(game_id=game_id)
        field = SingleGameDataSerializer(field_res).data.get('field_parameters')
        heatmap = GPXFunctions.draw_heatmap(df, field)
        return Response({'heatmap': heatmap}, status=status.HTTP_200_OK)


class AllGameData(APIView):
    #permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        email = request.data['email']
        data = GameData.objects.all().filter(user_id=AppUser.objects.get(email=email)) # TODO hardcoded. Need to fix
        serializer = AllGameDataSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SingleGameData(APIView):
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        game_id = request.data['game_id']
        query = str(PlayerMovement.objects.filter(game_id=game_id).query)
        df = pd.read_sql_query(query, connection)
        heart_rate = GPXFunctions.heartrate_by_min(df)
        game_res = GameData.objects.get(game_id=game_id)
        game_data = SingleGameDataSerializer(game_res)
        title = game_data.data.get('game_title')
        position = game_data.data.get('position')
        date = game_data.data.get('game_date')
        avg_speed = game_data.data.get('avg_speed')
        total_distance = game_data.data.get('total_distance')
        return Response(
            {'title': title, 'position': position, 'date': date, 'avg_speed': avg_speed, 'total_distance':total_distance, 'heart_rate': heart_rate},
            status=status.HTTP_200_OK)


class NewGameData(APIView):
    authentication_classes = (SessionAuthentication,)
    #permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        events = request.data['events']
        avg_speed, total_distance, gpx_data = GPXFunctions.parse_gpx(request.data['gpx'], events)
        title = request.data['title']
        email = request.data['email']
        position = request.data['position'] # TODO add position to Gamedata table
        #print(gpx_data)
        date = gpx_data.at[0, 'SessionDate']
        field = request.data['field'][0]
        field_params = ""
        for coordinate in field:
            if len(field_params) > 0:
                field_params += " "
            field_params += str(coordinate['lat']) + " "
            field_params += str(coordinate['lng'])
        #return Response(status=status.HTTP_200_OK) # TODO REMOVE ONCE parsing events array in parse_gpx is implemented
        gd = GameData.objects.create(
            game_title=title,
            game_date=date,
            field_parameters=field_params,
            user_id=AppUser.objects.get(email=email),
            position=position,
            avg_speed=avg_speed,
            total_distance=total_distance
        )
        player_movements = [
            PlayerMovement(
                timestamp=row['Timestamp'],
                latitude=row['Latitude'],
                longitude=row['Longitude'],
                heart_rate=row['Heart Rate'] if not pd.isna(row['Heart Rate']) else None,
                switch_sides=row['Side'],
                user_id=AppUser.objects.get(email=email),
                game_id=gd,
            )
            for index, row in gpx_data.iterrows()
        ]
        with transaction.atomic():  # using a transaction to ensure data integrity
            PlayerMovement.objects.bulk_create(player_movements)
        return Response(status=status.HTTP_201_CREATED)