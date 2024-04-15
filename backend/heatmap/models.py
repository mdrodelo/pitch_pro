from django.db import models
from user_api.models import AppUser


class GameData(models.Model):
    game_id = models.AutoField(primary_key=True)
    game_title = models.CharField(max_length=50, null=True)
    user_id = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='+')
    game_date = models.DateField()
    field_parameters = models.TextField()

    def create_game(self, title, date, field, user):
        game = self.model(game_title=title, game_date=date, user_id=user, field_parameters=field)
        game.save()
        return game



# creating PlayerMovements data table
class PlayerMovement(models.Model):
    user_id = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='+')
    game_id = models.ForeignKey(GameData, on_delete=models.CASCADE)
    movement_id = models.BigAutoField(primary_key=True)  # MovementID as a primary key
    timestamp = models.TimeField()  # Timestamp
    latitude = models.FloatField()  # Latitude
    longitude = models.FloatField()  # Longitude
    heart_rate = models.IntegerField(null=True, blank=True)  # Heart Rate, allowing null values
    switch_sides = models.BooleanField()
