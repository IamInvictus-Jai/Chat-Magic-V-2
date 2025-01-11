# **Chat-Magic-V-2**
Unleash the power of seamless communication with Chat Magic, the web group chat app that enchants your conversations. Designed with a touch of wizardry and a sprinkle of charm, Chat Magic brings your group interactions to life, making every message feel like a magical incantation.

This is Version 2 of its very first prototype.

## **Whats New !**
> + Custom Logo
> + UI Improvements
> + Bug Fixes ( solved websocket connection error and other glitches )
> + New Added Features ( Active Users Section, Pop Up Notifications, etc )

## **Features:**
> + Realtime Communication: Utilizes WebSocket technology through django channels and daphne to enable instant messaging between users.
> + Interactive UI: eye catchy ui design to enhance user experiences.
> + Voice Typing: users can type just by speaking (using microsoft speech to text api) *use chrome or edge browser for best experience.
> + Multiple rooms: Allows users to create and join different chat rooms, facilitating discussions on various topics.
> + User Presence Indicators: Displays indicators to show when users are online or typing messages in real-time.

## **Technologies Used**
> + Built using HTML, CSS and JS.
> + Django on the backend.
> + Django Channels for websocket connection to enable realtime communication

## **Installation**
To run this app locally, follow these steps:
> 1. Clone the repository to your local machine
> ```
> git clone https://github.com/IamInvictus-Jai/Chat-Magic-V-2.git
> ```
> 2. Navigate to the root directory of the project, open the directory in terminal and run
> ```
> pip install requirements.txt
> ```
> 3. Once the dependencies are installed, in terminal run
> ```
> python manage.py collectstatic
> ```
> 4. Once done, run
> ```
> python manage.py migrate
> ```
> 5. After the migrations have been applied, you are good to go. run this cmd to start the server
> ```
> python manage.py runserver
> ```
> 6. Access through the link ( http://127.0.0.1:8000/ )  provided using your browser.

## **Future Upgrades**
> Bug Fixes
> UI Improvements
> Performance Optimisation: focus on optimising the code for better performance
> Login and SignUp: user authentication
> Message Caching: for chat history so messages persists
> Emoji Feature: new emoji section in chats
> User Profile: enable user to create username, profile-pic and bio
> New Chat Page Features: like theme selection, chat controls, etc
> AI Bot Implementation: like that of meta in whatsapp and facebook

## **Live Demo**
> https://chat-magic.onrender.com/

> **Note: since it's hosted on a free tier, it may take 40s - 1min to load and there may be chances that the free tier have ended by this time. But no worries you can always try this app on your local machine.

### ***Rate this project and do let me know if you learned something from this project***
### ***For querries you can cantact: prof.techinvictus@gmail.com***

I'll see you in next exciting project 🚀
Happy Coding 🌟
