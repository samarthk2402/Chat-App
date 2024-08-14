import json

from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self): # called on connection
        self.accept() # accept web socket connection

    def disconnect(self, close_code): # called when connection closes
        pass

    def receive(self, text_data): # called when message is recieved
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        self.send(text_data=json.dumps({"message": message}))