const chatForm = document.getElementById('chatform')
const chatMessages = document.querySelector('.chatmessages')

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

socket.emit('join', { username, room })

// msg from server
socket.on('message', message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// submit message

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = event.target.elements.msg.value;
    //emit message to server
    socket.emit('chatMessage', message)
    // clear
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus() = '';
})

// output message to dom
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`
    document.querySelector('.chatmessages').appendChild(div)
}