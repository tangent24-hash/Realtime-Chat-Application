
from rest_framework import generics, permissions
from accounts.models import MyUser
from .models import Group, Message
from .serializers import GroupSerializer, MessageSerializer, JoinGroupSerializer


class GroupListCreateView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user,
                        members=[self.request.user])


class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class JoinGroupView(generics.UpdateAPIView):
    queryset = Group.objects.all()
    serializer_class = JoinGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        group = self.get_object()
        group.members.add(request.user)
        return super().update(request, *args, **kwargs)


class InviteUserView(generics.UpdateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        group = self.get_object()
        email = request.data.get('email')
        user = MyUser.objects.get(email=email)
        group.members.add(user)
        return super().update(request, *args, **kwargs)


class MessageListCreateView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(group_id=self.kwargs['group_id'])

    def perform_create(self, serializer):
        group = Group.objects.get(id=self.kwargs['group_id'])
        serializer.save(user=self.request.user, group=group)
