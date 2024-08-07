from django.db import models
from django.contrib.auth.models import User  # Import the User model
import random
import string

def generate_random_code():
    length = 6

    while True:
        code = "".join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code

# Create your models here.
class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_random_code, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    all_admin = models.BooleanField()
    admins = models.ManyToManyField(User, related_name='admin_rooms')  # ManyToManyField to User
    members = models.ManyToManyField(User, related_name='rooms')
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)