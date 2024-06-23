
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Group, Message

class GroupSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    members = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all(), many=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'created_by', 'members']

class MessageSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    group = serializers.ReadOnlyField(source='group.name')

    class Meta:
        model = Message
        fields = ['id', 'user', 'group', 'content', 'timestamp']
