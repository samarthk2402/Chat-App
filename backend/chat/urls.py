from .views import *
from django.urls import path

urlpatterns = [
    path("messages/<str:room_code>", GetMessages.as_view())
]