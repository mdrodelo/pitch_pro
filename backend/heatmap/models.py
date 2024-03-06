from django.db import models
from user_api.models import AppUser


class GameData(models.Model):
    game_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(AppUser, on_delete=models.DO_NOTHING, related_name='+')
    game_date = models.DateField()
    field_parameters = models.TextField()


# creating PlayerMovements data table
class PlayerMovement(models.Model):
    user_id = models.ForeignKey(AppUser, on_delete=models.DO_NOTHING, related_name='+')
    game_id = models.ForeignKey(GameData, on_delete=models.DO_NOTHING)
    movement_id = models.BigAutoField(primary_key=True)  # MovementID as a primary key
    session_date = models.DateField()  # SessionDate
    timestamp = models.TimeField()  # Timestamp
    latitude = models.FloatField()  # Latitude
    longitude = models.FloatField()  # Longitude
    heart_rate = models.IntegerField(null=True, blank=True)  # Heart Rate, allowing null values
    switch_sides = models.BooleanField()
