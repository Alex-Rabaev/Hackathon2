from django.db import models


# Create your models here.
class MyListGame(models.Model):
    title = models.CharField(max_length=50)
    gameId = models.IntegerField()

    def __str__(self) -> str:
        return self.title
