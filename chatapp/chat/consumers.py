import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Group


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(self.scope)
        self.user = self.scope["user"]
        self.room_group_name = self.scope['url_route']['kwargs']['group_id']

        self.group = await database_sync_to_async(Group.objects.get)(id=self.room_group_name)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        if 'message' in data:
            message = data['message']
            sender = self.user

            await self.create_group_message(sender, self.group, message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': sender.email,
                }
            )
        elif 'typing' in data:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing',
                }
            )

    @database_sync_to_async
    def create_group_message(self, sender, group, message):
        return Message.objects.create(user=sender, group=group, content=message)

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
        }))

    async def typing(self, event):
        await self.send(text_data=json.dumps({
            'typing': True
        }))
