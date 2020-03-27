const chatForm = document.getElementById('chatform')

const socket = io();

socket.on('message', message => {
    console.log(message)
})

// submit message

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = event.target.elements.msg.value;
    //emit message to server
    socket.emit('chatMessage', message)
})