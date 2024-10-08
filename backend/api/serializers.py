
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["name", "description", "all_admin"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        

    def create(self, validated_data):
        if User.objects.filter(username=validated_data['username']).exists():
            raise serializers.ValidationError("Username is already in use.")
            return 

        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        user.save()

        return user
    

    

