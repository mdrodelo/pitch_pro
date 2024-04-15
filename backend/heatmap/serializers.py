from rest_framework import serializers
from heatmap.models import GameData, PlayerMovement
#from user_api.models import AppUser
# https://www.django-rest-framework.org/api-guide/serializers/

class AllGameDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameData
        exclude = ['user_id']


class GameDataSerializer(serializers.ModelSerializer):
    class PlayerMovementSerializer(serializers.ModelSerializer):
        class Meta:
            model = PlayerMovement
            exclude = ['user_id', 'game_id']
    #playerMovement = PlayerMovementSerializer()

    class Meta:
        model = GameData
        fields = '__all__'

    def create(self, clean_data):
        print(clean_data['title'])
        print(clean_data['gpx'])
        pass


class HeatMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerMovement
        exclude = ['user_id', 'game_id', 'movement_id']

class SingleGameDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameData
        #fields = '__all__'
        exclude = ['user_id', 'game_id', 'game_title', 'game_date']