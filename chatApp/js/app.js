const chatForm = document.getElementById('chatform')
const chatMessages = document.querySelector('.chat-msgs')
const roomName = document.getElementById('room-name');
const friends = document.getElementById('users')

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

socket.emit('join', { username, room })

socket.on('roomUsers', ({ room, users}) => {
    roomOutput(room);
    userOutput(users);
})

// msg from server
socket.on('message', message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// submit message
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = event.target.elements.msgInput.value;
    socket.emit('chatMessage', message)

    event.target.elements.msgInput.value = '';
    event.target.elements.msgInput.focus() = '';
})

// output message to dom
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`
    document.querySelector('.chat-msgs').appendChild(div)
}

function roomOutput(room) {
    roomName.innerText = room;
}

function userOutput(users) {
    friends.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}