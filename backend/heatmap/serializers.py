from rest_framework import serializers
from heatmap.models import GameData
from user_api.models import AppUser
# https://www.django-rest-framework.org/api-guide/serializers/


class GameDataSerializer(serializers.ModelSerializer):
    """class Meta:
        model = GameData
        fields = '__all__'"""

