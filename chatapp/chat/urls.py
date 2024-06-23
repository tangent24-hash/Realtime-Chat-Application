
from django.urls import path
from .views import GroupListCreateView, GroupDetailView, JoinGroupView, InviteUserView, MessageListCreateView

urlpatterns = [
    path('groups/', GroupListCreateView.as_view(), name='group_list_create'),
    path('groups/<int:pk>/', GroupDetailView.as_view(), name='group_detail'),
    path('groups/<int:pk>/join/', JoinGroupView.as_view(), name='join_group'),
    path('groups/<int:pk>/invite/', InviteUserView.as_view(), name='invite_user'),
    path('groups/<int:group_id>/messages/',
         MessageListCreateView.as_view(), name='message_list_create'),
]
