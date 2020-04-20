const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);

const io = require('socket.io').listen(server);
var cors = require('cors')

app.use(cors())

io.on('connection', (socket) => {
    var addedUser = false;
    io.use((socket, next) => {
        let token = socket.handshake.query.token;
        if (token == '7704606eed6a12efeda33428152dbd99') {
            return next();
        }
        return next(new Error('authentication error'));
    });


    socket.on('scleave', () => {
        let vrroom = socket.room;
        console.log(vrroom, 'leave --------------')
        socket.leaveAll
    });

    socket.on('scjoin', (message) => {
        if (addedUser) return;
        console.log("------- ENTROU --------")

        let vrroom = `room${message.room}`;
        socket.join(vrroom);

        socket.room = vrroom;

        socket.artist = message.artist;
        socket.username = message.username;
        socket.id = message.id;
        socket.foto = message.foto;

        addedUser = true;

        io.to(vrroom).emit('scentrou', {

            chatMessage: 'entrou',
            artist: socket.artist,
            username: socket.username,
            id: socket.id,
            foto: socket.foto,

        });


    });

    socket.on('disconnect', () => {
        if (addedUser) {
            console.log("------- SAIU --------")

            io.to(socket.room).emit('scsaiu', {

                chatMessage: 'Saiu',
                artist: socket.artist,
                username: socket.username,
                id: socket.id,
                foto: socket.foto,

            });
        }
    });

    socket.on('scnovamsg', (message) => {

        console.log("------- NOVA MENSAGEM --------")

        io.to(`room${message.room}`).emit('scnovamsgsala', {

            room: message.room,
            chatMessage: message.chatMessage,
            artist: message.artist,
            username: message.username,
            id: message.id,
            foto: message.foto,

        });

    });

});

server.listen(46444, err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`CHAT 46444`);
    }
});
