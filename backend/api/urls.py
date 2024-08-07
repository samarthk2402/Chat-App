from .views import *
from django.urls import path

urlpatterns = [
    path("room/create", CreateRoom.as_view()),
    path("rooms", ListRooms.as_view())
]
