from accounts.models import MyUser
from django.db import models


class Group(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(MyUser, related_name='groups')
    created_by = models.ForeignKey(
        MyUser, related_name='created_groups', on_delete=models.CASCADE)


class Message(models.Model):
    user = models.ForeignKey(
        MyUser, related_name='messages', on_delete=models.CASCADE)
    group = models.ForeignKey(
        Group, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
