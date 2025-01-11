const chatInput = document.querySelector(".chat-input");
const sendButton = document.getElementById("send-button");
const micButton = document.getElementById("mic-button");
const chatMessages = document.querySelector(".chat-messages");
const micIcon = micButton.querySelector(".mic-icon");
const clearText = document.querySelector("#clear-text-field");

let isMicActive = false;
let newConnection = true;
let isNewConnection = sessionStorage.getItem("isNewConnection") || 'true';
isNewConnection = (isNewConnection === 'true');


document.querySelector(".chat-menu").style.height = "0";
document.querySelector(".chat-menu-btn").style.opacity = "0.7";
document.querySelector(".group-members").style.opacity = "0.7";

let userID = document.querySelector(".user-id").value.trim();
let roomID = document.querySelector(".room-id").value.trim();


let extractID = function () {
  const regex = new RegExp(`${roomID.split("-")[0]}-(.*)`);
  const match = roomID.match(regex);

  if (match && match[1]) {
    const extractedPart = match[1]; // roomname-uniqueroomid
    return extractedPart;
  }
}

const timestamp = new Date().getTime();
let url = `ws://${window.location.host}/ws/chat/${extractID()}/${userID}/?&_=${timestamp}`;
const chatSocket = new WebSocket(url);


// Play avatar audio message (Future Implementation)
let play_audio = function (audioType) {
  // Create a new AudioContext
  const audioContext = new AudioContext();

  // Create a new AudioBufferSourceNode
  const source = audioContext.createBufferSource();
  const audio = "/static/audio/" + ((audioType === "notify") ? "notify.mp3" : "pop notification.mp3");

  // Load the audio file
  fetch(audio)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      // Set the audio buffer
      source.buffer = audioBuffer;

      // Connect the source to the destination
      source.connect(audioContext.destination);
      
      // Start playing the audio
      source.start();
    });
}

// Update User Message
let userResponse = function (response) {
  const time = new Date()

  let userMessageElement = `
            <div class="user">
            <div class="profile-pic message user"
              style="background: #969696 url('/static/images/chat/user.png') center/cover;">
            </div>
            <div class="message sent">
              ${response}
              <p class="message-time user">${time.getHours()}:${time.getMinutes()}</p>
              <p class="message-user-id user">YOU</p>
            </div>
          </div>
        `;
  const userMessage = document.createElement("div");
  userMessage.classList.add("user");
  userMessage.innerHTML = userMessageElement;
  chatMessages.appendChild(userMessage);

  chatInput.value = "";
  chatInput.style.height = "auto";
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add typing animation
let typingAnimation = function() {
  let profile_pic = document.querySelector(".profile-pic").style.backgroundImage;
  profile_pic = profile_pic.replace(/"/g, "'");
  let typingAnimation = `
            <div class="profile-pic message avatar"
              style="background: ${profile_pic} center/cover;">
            </div>
            <div class="typing-dots">
              <div class="dot" style= "--delay: 200ms;"></div>
              <div class="dot" style= "--delay: 300ms;"></div>
              <div class="dot" style= "--delay: 400ms;"></div>
            </div>
            `;
  let div = document.createElement("div");
  div.classList.add("avatar");
  div.innerHTML = typingAnimation;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

let update_chats = function (data) {
  let senderID = data.userID;
  let message = data.message;

  if (userID === senderID) {return; }

  // Play Message Pop Audio
  play_audio("message");

  const time = new Date();
  let messageElement = `
            <div class="sender">
            <div class="profile-pic message user"
              style="background: #969696 url('/static/images/chat/user.png') center/cover;">
            </div>
            <div class="message received">
              ${message}
              <p class="message-time sender">${time.getHours()}:${time.getMinutes()}</p>
              <p class="message-user-id sender">${senderID}</p>
            </div>
          </div>
        `;
  const receivedMessage = document.createElement("div");
  receivedMessage.classList.add("sender");
  receivedMessage.innerHTML = messageElement;
  chatMessages.appendChild(receivedMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show Pop Notification
let pop_notification = function (new_member, status) {
  play_audio("notify");

  let notification = document.createElement("div");
  notification.classList.add("notify");
  notification.innerHTML = `<p>${new_member} has ${status} the group</p>`;

  let notificationBox = document.querySelector(".notification-box");
  notificationBox.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5200);
};

let update_members = function (data) {
  let new_member = data.new_member;
  new_member = new_member.split(" ").join(".");
  let new_memberList = data.new_memberList;
  let members = document.querySelector(".members");

  if (newConnection) {
    new_memberList.forEach((member) => {
      
      let member_new = document.createElement("div");
      member_new.classList.add("member");
      if (member === userID) {
        member_new.classList.add("active");
      }
      member = member.split(" ").join(".");
      member_new.classList.add(`${member}`);
      member_new.textContent = member;

      members.appendChild(member_new);
    });
    newConnection = false;
    return;
  }
  let member_new = document.createElement("div");
  member_new.classList.add("member");
  member_new.classList.add(`${new_member}`);
  member_new.textContent = new_member;

  members.appendChild(member_new);  
}

let remove_member = function (data) {
  let removed_member = data.removed_member;
  console.log("Removed Member:", removed_member);
  if (!removed_member) {return;}
  console.log("Removed Member:", removed_member);
  removed_member = removed_member.split(" ").join(".");
  let members = document.querySelector(".members");
  let member = members.querySelector(`.member.${removed_member}`);

  if (!member) {return;}
  members.removeChild(member);
  console.log("Removed Member:", removed_member);
}

// Send message function
function sendMessage() {
  let message = chatInput.value.trim();
  if (message) {
    // Add message to the chats
    userResponse(message);

    // Create message object
    const message_obj = {
      'userID': userID,
      'message': message,
    };

    // send data to server
    chatSocket.send(JSON.stringify(message_obj));
    chatInput.value = "";
  }
}

// ________________________ Socket Connection _________________________

// Establish a Websocket connection with the server and communicate
chatSocket.onopen = () => {
  console.log("connected");

  let client_obj = {
    isNewConnection: isNewConnection,
    userID: userID,
  }

  if (!isNewConnection) {
    client_obj.type = "refresh";
    client_obj.channel_name = sessionStorage.getItem("channel_name")
  }
  else {sessionStorage.setItem("isNewConnection", false); }
  chatSocket.send(JSON.stringify(client_obj));
}

// Recieve Data from the server
chatSocket.onmessage = function (event) {
  let data = JSON.parse(event.data);
  switch (data.statusCode) {
    case 200:
      update_chats(data);
      break;

    case 202:
      console.log(data.server);
      break;

    case 204:
      update_members(data);
      pop_notification(data.new_member, "joined");
      break;
    
    case 206:
      remove_member(data);
      pop_notification(data.removed_member, "left");
      break;
    
    case 208:
      update_members(data);
      break;
    
    case 210:
      let channel_name = data.channel_name
      console.log(channel_name)
      sessionStorage.setItem("channel_name", channel_name)
      break;

    default:
      return;
  }
};

// ______________________________________________________________________


// Auto-resize input field
chatInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";

  if (this.value === "") {
    this.style.height = "auto";
  }
});

// Clear the text input field
clearText.addEventListener("click", function () {
  chatInput.value = '';

})

// Send message on enter
chatInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Toggle microphone
micButton.addEventListener("click", function () {
  isMicActive = !isMicActive;
  micIcon.classList.toggle("mic-active");

  if (isMicActive) {
    chatInput.placeholder = "Listening...";
    micButton.id = "mic-button-active";
  } else {
    chatInput.placeholder = "Type a message...";
    micButton.id = "mic-button";
  }
});

// Back button animation
document.querySelector(".back-button").addEventListener("click", function () {
  this.style.transform = "translateX(-.8rem)";
  setTimeout(() => {
    this.style.transform = "translateX(0)";
    window.location.href = `${window.location.origin}/chat-magic/join-chat-room/?room_id=${roomID}`;
  }, 200);
});

// Chat Menu Toggle
document.querySelector(".chat-menu-btn").addEventListener("click", function () {
  let menu = document.querySelector(".chat-menu");
  menu.style.height = (menu.style.height === "0px") ? "100%" : "0";
  this.style.opacity = (this.style.opacity === "0.7") ? "1" : "0.7";
})

// Show group members
document.querySelector(".group-members").addEventListener("click", function (e) {
  let memberList = document.querySelector(".check-group-members");
  this.style.opacity = (this.style.opacity === "0.7") ? "1" : "0.7";
  memberList.classList.toggle("active");
});

// chatInput.value = `${window.innerHeight}`;
// Add smooth scrolling to messages
chatMessages.style.scrollBehavior = "smooth";
sendButton.addEventListener("click", sendMessage);