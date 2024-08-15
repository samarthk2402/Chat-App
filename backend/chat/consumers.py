import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Message, Room
from django.contrib.auth.models import User
from .serializers import CreateMessageSerializer

class ChatConsumer(WebsocketConsumer):
    def connect(self): # called on connection
        # Extracting the group code from the URL route
        self.room_group_name = self.scope['url_route']['kwargs']['room_code']
        self.username = self.scope['url_route']['kwargs']['username']
        
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept() # accept web socket connection

    def disconnect(self, close_code): # called when connection closes
        print(close_code)

    def receive(self, text_data): # called when message is recieved
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        room = Room.objects.filter(code=self.room_group_name)[0]
        user = User.objects.filter(username=self.username)[0]

        serializer = CreateMessageSerializer(data={
            "room": room.id,
            "sender": user.id,
            "content": message
        })

        if serializer.is_valid():
            serializer.save()
            print(serializer)
        else:
            print("Error saving message: ", serializer.errors)
        

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": self.username 
            }
        )

    def chat_message(self, event):

        self.send(text_data=json.dumps({
            "type": "chat",
            "message": event["message"],
            "username": event["username"]
        }))