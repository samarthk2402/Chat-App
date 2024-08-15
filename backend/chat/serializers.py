from rest_framework import serializers
from .models import Message

class CreateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['room', 'sender', 'content']

class MessageSerializer(serializers.ModelSerializer):
    sender= serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['room', 'sender', 'content', 'sent_at']

    def get_sender(self, obj):
        # Access the sender's username
        return obj.sender.username