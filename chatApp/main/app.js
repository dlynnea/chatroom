const chatForm = document.getElementById('chatform')
const chatMessages = document.querySelector('.msg-list')
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

socket.on('message', message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = event.target.elements.msgInput.value;
    socket.emit('chatMessage', message)

    event.target.elements.msgInput.value = '';
    event.target.elements.msgInput.focus() = '';
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`
    document.querySelector('.msg-list').appendChild(div)
}

function roomOutput(room) {
    roomName.innerText = room;
}

function userOutput(users) {
    friends.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}




////

// $(document).ready(function(){
//     $('#message-box').keypress((e)=>{
//       if(e.which!=13){
//         typing=true
//         socket.emit('typing', {user:user, typing:true})
//         clearTimeout(timeout)
//         timeout=setTimeout(typingTimeout, 3000)
//       }else{
//         clearTimeout(timeout)
//         typingTimeout()
//         //sendMessage() function will be called once the user hits enter
//         sendMessage()
//       }
//     })

//     //code explained later
//     socket.on('display', (data)=>{
//       if(data.typing==true)
//         $('.typing').text(`${data.user} is typing...`)
//       else
//         $('.typing').text("")
//     })
// })