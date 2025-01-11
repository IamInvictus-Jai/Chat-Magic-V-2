from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('chat-magic/home/', views.home, name= 'home'),
    path('create_room_id/', views.create_room_id, name= 'create_room_id'),
    path('chat-magic/join-chat-room/', views.room, name= 'room'),
    path('chat-magic/redirect-chat-room/', views.chat_room, name= 'chat_room'),
    path('chat-magic/chat-rooms/', views.chat_rooms, name= 'chat_rooms'),
]