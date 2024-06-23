
from rest_framework import serializers
from accounts.models import MyUser
from .models import Group, Message


class GroupSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.email')
    members = serializers.ReadOnlyField(source='members.values_list')

    class Meta:
        model = Group
        fields = ['id', 'name', 'created_by', 'members']


class JoinGroupSerializer(serializers.ModelSerializer):
    members = serializers.ReadOnlyField(source='members.values_list')
    name = serializers.ReadOnlyField()

    class Meta:
        model = Group
        fields = ['name','members']


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    group = serializers.ReadOnlyField(source='group.name')

    class Meta:
        model = Message
        fields = ['id', 'user', 'group', 'content', 'timestamp']
