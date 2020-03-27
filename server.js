const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utilities/messages')
const { newUser, currentUser, userLeaves, allUsers } = require('./utilities/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const bot = 'Chatter Bot';
// set static folder
app.use(express.static(path.join(__dirname, 'chatApp')));

// run when client connects
io.on('connection', socket => {
    socket.on('join', ({ username, room }) => {
        const user = newUser(socket.id, username, room)
        socket.join(user.room)
        socket.emit('message', formatMessage(bot, 'Welcome to Chatter'));
        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined!`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: allUsers(user.room)
        })
    })
    //listen for chat message
    socket.on('chatMessage', (message) => {
        const user = currentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, message));
    })
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(bot, `${user.username} has just left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: allUsers(user.room)
            })
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));