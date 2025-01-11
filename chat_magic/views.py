from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt

from uuid import uuid4

#******************** Handle HTTP requests ********************

# Redirect to Home Page
def index(request) -> HttpResponse:
    return redirect('chat-magic/home')

# Render Home Page
def home(request) -> HttpResponse:
    return render(
        request= request,
        template_name= 'landingPage.html',
        context= {
            'timestamp': int(now().timestamp()),
        }
    )

# Generate Unique Room Id's
def create_room_id(request) -> HttpResponse:
    if request.method == 'GET':
        username: str = request.GET.get('username')
        room_name: str = request.GET.get('room_name')
        unique_id: str = f"{username}-{room_name}-{str(uuid4())}"
        return JsonResponse({'room_id': unique_id})
    
    return HttpResponse(status=400)

# Render Join Room Page
def room(request) -> HttpResponse:
    if request.method == 'GET':
        room_id: str = request.GET.get('room_id')
        return render(
            request= request,
            template_name= 'joinRoom.html',
            context= {
                'room_creator': room_id.split('-')[0],
                'room_name': room_id.split('-')[1],
                'room_id': room_id.split('-', maxsplit= 2)[2],
                'timestamp': int(now().timestamp()),
            }
        )

    return HttpResponse(status=400)

# Redirect to Chat Room Page
def chat_room(request) -> HttpResponse:

    if request.method == 'GET':
        userID = request.GET.get('username')
        room_id = request.GET.get('room_id')
        
        request.session['roomID'] = room_id
        request.session['userID'] = userID

        redirect_url = f"{request.scheme}://{request.get_host()}/chat-magic/chat-rooms"
        return redirect(redirect_url)    

    return HttpResponse(status=400)

# Render Chat Rooms
def chat_rooms(request) -> HttpResponse:

    if request.method == 'GET':
        roomID = request.session.get('roomID')
        userID = request.session.get('userID')

        if not roomID or not userID: pass
        return render(
            request= request,
            template_name= 'chatRoom.html',
            context= {
                'userID': userID,
                'room_name': roomID.split('-')[1],
                'roomID': roomID,
                'timestamp': int(now().timestamp()),
            }
        )

    return HttpResponse(status=400)