# Generated by Django 4.2.10 on 2024-03-23 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('heatmap', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playermovement',
            name='session_date',
        ),
        migrations.AddField(
            model_name='gamedata',
            name='game_title',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
