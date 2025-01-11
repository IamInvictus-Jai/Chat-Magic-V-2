from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<str:roomID>/<str:userID>/', consumers.ChatConsumer.as_asgi()),
]