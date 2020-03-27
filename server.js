const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'chatApp')));

// run when client connects
io.on('connection', socket => {
    // to a single user
    socket.emit('message', 'Welcome to Chat');
    //broadcast when user connects, emitting to everyone except user thats connecting
    socket.broadcast.emit('message', 'A new user has joined!');
    //runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has just left the chat')
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));