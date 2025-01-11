// Prevent scroll during loading animation
window.onbeforeunload = () => window.scrollTo(0, 0);

// Pop-up functionality
const popUp = document.querySelector(".pop-up");
const closeBtn = document.querySelector(".close-btn");
const buttons = document.querySelectorAll(".btn");
const roomBtn = document.querySelector(".room-btn");
const userNameInput = document.querySelector(".room-user");


// Function to open pop-up
const openPopUp = function (e) {
  popUp.classList.add("active");
  document.body.style.overflow = "hidden";

  // Set appropriate text based on button clicked
  if (this.classList.contains("btn-create")) {
    roomBtn.textContent = "Create Room";
  } else {
    roomBtn.textContent = "Join Room";
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
  }
};

// // Function to handle room creation/joining
// const handleRoom = function (e) {
//   e.preventDefault();
//   const username = userNameInput.value.trim();

//   if (!username) {
//     // Shake animation if empty
//     userNameInput.classList.add("shake");
//     setTimeout(() => userNameInput.classList.remove("shake"), 500);
//     return;
//   }
//   // Here you can add your room creation/joining logic
//   console.log(
//     `Room ${
//       roomBtn.textContent === "Create Room" ? "created" : "joined"
//     }: ${roomName}`
//   );

//   // Close popup after successful action
//   closePopUp({ target: popUp });
// };

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
document.addEventListener("keydown", handleKeyboard);

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