// Prevent scroll during loading animation
window.onbeforeunload = () => window.scrollTo(0, 0);

// Pop-up functionality
const popUp = document.querySelector(".pop-up");
const closeBtn = document.querySelector(".close-btn");
const buttons = document.querySelectorAll(".btn");
const roomBtn = document.querySelector(".room-btn");
const roomNameInput = document.querySelector(".room-name");
const userNameInput = document.querySelector(".room-user");
let roomID = null;
let roomLink = null;

// Join Room
const joinRoom = function () {
  const timestamp = new Date().getTime();
  window.location.href = `/chat-magic/redirect-chat-room/?room_id=${roomID}&username=${userNameInput.value.trim()}&_=${timestamp}`;
};

// Create Room ID
const generateRoomID = async function () {
  const timestamp = new Date().getTime();
  let url =
    `/create_room_id?username=${userNameInput.value.trim()}&room_name=${roomNameInput.value.trim()}&_=${timestamp}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Could not generate room !");
  }
};
let assignRoomID = async function () {
  if (roomID === null) {
    const data = await generateRoomID();
    roomID = data.room_id;
    roomLink = window.location.origin + `/chat-magic/join-chat-room/?room_id=${data.room_id}`;
    console.log('Assigned Room ID:', roomID);
  }
  return roomLink;
}
// Create Room
const createRoom = function () {

  assignRoomID().then(function () {
    let boxElement = `
              <button class="close-btn" aria-label="Close popup">
                  <i class="fas fa-times"></i>
              </button>
              <h2 class="cta-heading">Your Room ID</h2>
              <div class="room-id-wrapper" >
                <input type="text" aria-label="Room ID" class="room-input room-id" readonly value="${roomLink}">
                <button class="room-btn copy">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path
                      d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"
                    />
                  </svg>
                </button>
              </div>
              <p class="copy-text">Link Copied !</p>
              <button class="room-btn join">Join</button>
            `;

    document.querySelector(".pop-box").innerHTML = boxElement;
    document.querySelector(".room-btn.join").addEventListener("click", joinRoom);
    document.querySelector(".close-btn").addEventListener("click", function () {
      closePopUp({ target: popUp });
    });
    document
      .querySelector(".room-btn.copy")
      .addEventListener("click", function () {
        navigator.clipboard.writeText(roomLink);
        document.querySelector(".copy-text").classList.toggle("active");
        setTimeout(() => {
          document.querySelector(".copy-text").classList.toggle("active");
        }, 3500);
      });
    document
      .querySelector(".room-btn.join")
      .addEventListener("click", function () {
        closePopUp({ target: popUp });
      });
  });
}

// Function to open pop-up
const openPopUp = function (e) {
  popUp.classList.add("active");
  document.body.style.overflow = "hidden";

  if (roomID !== null) { createRoom(); return; }

  // Set appropriate text based on button clicked
  if (this.classList.contains("btn-create")) {
    roomBtn.textContent = "Create Room";
    roomNameInput.placeholder = "Room Name...";
  } else {
    roomBtn.textContent = "Join Room";
    roomNameInput.placeholder = "Room ID...";
  }

  // Focus on input after transition
  setTimeout(() => userNameInput.focus(), 300);
};

// Function to close pop-up
const closePopUp = function (e) {
  // If clicking outside pop-box or on close button
  if (
    e.target === popUp ||
    e.target === closeBtn ||
    e.target.closest(".close-btn")
  ) {
    popUp.classList.remove("active");
    document.body.style.overflow = "auto";

    // Clear input field
    userNameInput.value = "";
    roomNameInput.value = "";
  }
};

// Show Invalid Message
const alertInvalid = function () {
  document.querySelector(".invalid-message").classList.add("active");
  setTimeout(() => {
    document.querySelector(".invalid-message").classList.remove("active");
  }, 3500);
}
// Shake Anime for username
const shakeUserName = function () {
  userNameInput.classList.add("shake");
  setTimeout(() => userNameInput.classList.remove("shake"), 500);
}
// Shake anime for room name
const shakeRoomName = function () {
  roomNameInput.classList.add("shake");
  setTimeout(() => roomNameInput.classList.remove("shake"), 500);
};

// Function to handle room creation/joining
const handleRoom = function (e) {
  e.preventDefault();
  const username = userNameInput.value.trim();
  const roomName = roomNameInput.value.trim();

  if (!username) {
    // Shake animation if empty
    shakeUserName();
    return;
  }

  if (!roomName) {
    // Shake animation if empty
    shakeRoomName();
    return;
  }
  let regex = "^[a-zA-Z0-9_]+$";
  if (!username.match(regex)) {
    alertInvalid();
    shakeUserName();
    return;
  }
  else if (!roomName.match(regex)) {
    alertInvalid();
    shakeRoomName();
    return;
  }
  createRoom();
  // Close popup after successful action
  // closePopUp({ target: popUp });
};

// Function to handle keyboard events
const handleKeyboard = function (e) {
  if (e.key === "Escape" && popUp.classList.contains("active")) {
    closePopUp({ target: popUp });
  }

  if (e.key === "Enter" && popUp.classList.contains("active")) {
    handleRoom(e);
  }
};

// Event Listeners
buttons.forEach((btn) => btn.addEventListener("click", openPopUp));
popUp.addEventListener("click", closePopUp);
closeBtn.addEventListener("click", closePopUp);
roomBtn.addEventListener("click", handleRoom);
document.addEventListener("keydown", handleKeyboard);
roomNameInput.addEventListener("input", function () {
  // Remove any error states on input
  this.classList.remove("shake");
});
 
// Prevent propagation of clicks inside pop-box
document.querySelector(".pop-box").addEventListener("click", function (e) {
  e.stopPropagation();
});

// Add CSS for shake animation if not already in CSS file
const style = document.createElement("style");
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
        border-color: #ff4444 !important;
    }
`;
document.head.appendChild(style);