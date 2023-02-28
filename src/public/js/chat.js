const socket = io();
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const messages = document.querySelector('#messages');

socket.on('chat message', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    messages.appendChild(messageElement);
});

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
      socket.emit('chat message', message);
      messageInput.value = '';
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Please enter a message'
      });
    }
});