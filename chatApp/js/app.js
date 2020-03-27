const chatForm = document.getElementById('chatform')
const chatMessages = document.querySelector('.chatmessages')
const socket = io();

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
})

// output message to dom
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta">Dani <span>time</span></p>
    <p class="text">${message}</p>`
    document.querySelector('.chatmessages').appendChild(div)
}