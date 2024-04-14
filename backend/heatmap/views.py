from django.shortcuts import render
from django.db import transaction
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework import permissions, status
from .serializers import GameDataSerializer, AllGameDataSerializer
from rest_framework.response import Response
import base64
import heatmap.data as data
import pandas as pd

from user_api.models import AppUser
from heatmap.models import GameData, PlayerMovement

# Imports that should be moved to backend
from mplsoccer import Pitch, Sbopen
import io
# end of these imports


class Heatmap(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        print(request)
        parser = Sbopen()
        df_false9 = parser.event(69249)[0]
        df_false9 = df_false9.loc[df_false9.player_id == 5503, ['x', 'y']]
        test_pitch = Pitch(line_color='black', line_zorder=2)
        test_fig, testax = test_pitch.draw(figsize=(10, 5))
        kde = test_pitch.kdeplot(df_false9.x, df_false9.y, ax=testax, fill=True)
        buf = io.BytesIO()
        test_fig.savefig(buf, format='png')
        buf.seek(0)
        heatmap = buf.read() # This is where the function returned in PitchPro main file
        # start of original view file
        res = base64.b64encode(heatmap)
        res = res.decode('utf-8')
        data = "data:image/jpeg;base64," + res
        return Response({'heatmap': data}, status=status.HTTP_200_OK)


class AllGameData(APIView):
    #permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        email = request.data['email']
        data = GameData.objects.all().filter(user_id=AppUser.objects.get(email=email)) # TODO hardcoded. Need to fix
        serializer = AllGameDataSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NewGameData(APIView):
    authentication_classes = (SessionAuthentication,)
    #permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        events = request.data['events']
        gpx_data = data.parse_gpx(request.data['gpx'])
        title = request.data['title']
        email = request.data['email']
        position = request.data['position'] # TODO add position to Gamedata table
        date = gpx_data.at[0, 'SessionDate']

        print(events)
        field = request.data['field'][0]
        field_params = ""
        for coordinate in field:
            if len(field_params) > 0:
                field_params += " "
            field_params += str(coordinate['lat']) + " "
            field_params += str(coordinate['lng'])
        return Response(status=status.HTTP_200_OK) # TODO REMOVE ONCE parsing events array in parse_gpx is implemented
        gd = GameData.objects.create(
            game_title=title,
            field_parameters=field_params,
            game_date=date,
            user_id=AppUser.objects.get(email=email)
        )
        player_movements = [
            PlayerMovement(
                timestamp=row['Timestamp'],
                latitude=row['Latitude'],
                longitude=row['Longitude'],
                heart_rate=row['Heart Rate'] if not pd.isna(row['Heart Rate']) else None,
                switch_sides=False,
                user_id=AppUser.objects.get(email=email),
                game_id=gd,
            )
            for index, row in gpx_data.iterrows()
        ]
        with transaction.atomic():  # using a transaction to ensure data integrity
            PlayerMovement.objects.bulk_create(player_movements)
        return Response(status=status.HTTP_201_CREATED)