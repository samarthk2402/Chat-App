from django.shortcuts import render
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status


class ListRooms(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    
    def get_queryset(self):
        user = self.request.user
        return user.rooms


class CreateRoom(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateRoomSerializer
    queryset = Room.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(creator = self.request.user, admins = [self.request.user], members = [self.request.user])
        else:
            print(serializer.errors)

class JoinRoom(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = self.request.user
        room_code = request.data.get("code")
        if room_code != None:
            rooms = Room.objects.filter(code=room_code)
            if len(rooms) > 0:
                room = rooms[0]
                if not room.members.filter(id=user.id).exists():
                    room.members.add(user)
                    room.save()
                    room_serializer = RoomSerializer(room)
                    return Response({"room": room_serializer.data}, status=status.HTTP_201_CREATED)
                return Response({"message": "You are already in this room..."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": "No rooms found with that room code..."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "Room code not given..."}, status=status.HTTP_400_BAD_REQUEST)

    
class SignUp(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)

        accountsWithSameEmail = User.objects.filter(email=request.data.get("email"))
        if len(accountsWithSameEmail) > 0:
            return Response({"msg": "email taken"}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            user = serializer.save()
        else:

            # Extract error codes and messages
            errors = serializer.errors
            
            # Optionally: Construct a more detailed error response
            detailed_errors = {
                field: [
                    {"message": str(err), "code": err.code}
                    for err in error_list
                ]
                for field, error_list in errors.items()
            }

            print(detailed_errors)
            return Response(detailed_errors, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        response_data = {
            'user': UserSerializer(user).data,  # Serialize the user object to include in the response
            'refresh': str(refresh),
            'access': str(refresh.access_token),  # Include the access token in the response
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

