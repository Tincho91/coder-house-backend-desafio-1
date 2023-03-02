const socket = io();
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");
const messages = document.querySelector(".messages");
let userId;

Swal.fire({
  title: 'Enter User ID',
  input: 'text',
  inputAttributes: {
    autocapitalize: 'off'
  },
  showCancelButton: false,
  confirmButtonText: 'Login',
  showLoaderOnConfirm: true,
  preConfirm: (input) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (input === '') {
          Swal.showValidationMessage('Please enter a user ID');
        } else {
          userId = input;
          resolve();
        }
      }, 1000);
    });
  },
  allowOutsideClick: false
}).then(() => {
  // Emit the setUserId event to the server with the user ID
  socket.emit('setUserId', userId);
});

// Listen for incoming chat messages
socket.on("chat message", (data) => {
  const { userId: messageUserId, message } = data;
  const li = document.createElement("li");

  li.innerHTML = `<span class="user-id">${messageUserId}</span> ${message}`;

  if (messageUserId === userId) {
    li.classList.add("sent");
  } else {
    li.classList.add("received");
  }

  messages.appendChild(li);
});

// Send a chat message
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("chat message", { userId, message }); // add userId to the chat message object
    messageInput.value = "";
    const li = document.createElement("li");
    li.innerHTML = `<span class="user-id">${userId}</span> ${message}`;
    li.classList.add("sent");
    messages.appendChild(li);
  } else {
    Swal.fire({
      icon: "error",
      text: "Please enter a message",
    });
  }
});