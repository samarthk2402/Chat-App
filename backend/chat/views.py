from django.shortcuts import render
from rest_framework.generics import ListAPIView
from .serializers import MessageSerializer
from api.models import Room
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class GetMessages(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        room_code = self.kwargs.get("room_code")
        room = Room.objects.filter(code=room_code)
        if len(room)>0:
            return room[0].messages
        return [{"Error": "No room found with that code..."}]
    