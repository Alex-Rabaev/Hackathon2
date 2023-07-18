from rest_framework import serializers
from .models import UserProfile
from games.models import MyListGame


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"


class MyListGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyListGame
        fields = "__all__"
