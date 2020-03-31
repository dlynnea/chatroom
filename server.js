const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./chatApp/utilities/messages')
const { newUser, currentUser, userLeaves, allUsers } = require('./chatApp/utilities/users')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const bot = 'Cafe-Bot';

app.use(express.static(path.join(__dirname, 'chatApp')));

io.on('connection', socket => {
    socket.on('join', ({ username, room }) => {
        const user = newUser(socket.id, username, room)
        socket.join(user.room)
        socket.emit('message', formatMessage(bot, 'Welcome to Craft Chat'));
        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined ${user.room} Chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: allUsers(user.room)
        })
    })

    socket.on('chatMessage', (message) => {
        const user = currentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, message));
    })
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(bot, `${user.username} has left ${user.room} Chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: allUsers(user.room)
            })
        }
    });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));