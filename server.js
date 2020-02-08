const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const mysql = require('mysql');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use(cors());

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const dbConnection = mysql.createConnection({
     host: conf.host,
     user: conf.user,
     password: conf.password,
     port: conf.port,
     database: conf.database
});
dbConnection.connect();

const server = http.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));
// const allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// } // error Origin <origin> has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

const io = socketio(server);

io.on('connect', (socket) => {
    console.log('new connection');

    // socket.on('서버에서 받을 이벤트 명') 
    // socket.emit('서버로 보낼 이벤트 명')
    // io.to(소켓아이디).emit('이벤트명'); 특정한 사람에게 메세지를 보낼 수 있음
    // https://www.zerocho.com/category/NodeJS/post/57edfcf481d46f0015d3f0cd 참고
    socket.on('join room', ({ name, room }, callback) => {
        console.log(name, room);
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});

        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message});
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    
        callback();
    });

    socket.on('disconnect', () => {
        console.log('User had left');
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left`});
        }
    });
});

// app.use(allowCrossDomain);  

// Home
app.get('/join', (req, res) => {
    console.log('join get')
});

app.post('/join', (req, res) => {
    console.log('join post'); // insert문
});

// Login
app.get('/signin', (req, res) => {
    console.log('singin get');
});

app.post('/signin', (req, res) => {
    console.log('signin post');
});

// Main
app.get('/createroom', (req, res) => {
    console.log('createroom get');
});

app.post('/createroom', (req, res) => {
    console.log('createroom post');
    console.log(req.body);

    let sql = "INSERT INTO ROOM(room_name, room_password, create_room_date, user_id) VALUES (?, ?, now(), ?)";

    let roomname = req.body.roomname;
    let roompassword = req.body.roompassword;
    let roomowner = req.body.roomowner;
    let params = [roomname, roompassword, roomowner];
    dbConnection.query(sql, params,
        (err, rows, fields) => {
            if(err) console.log("createroom error" + err);
            else res.send(rows);
    });
});

app.get('/rooms', (req, res) => {
    console.log('rooms get');
    let sql = "SELECT room_id, room_name, user_name from ROOM, USER where ROOM.user_id = USER.user_id;";
    dbConnection.query(sql, 
        (err, rows, fields) => {
            if(err) console.log("rooms error" + err);
            else res.send(rows);
        }
    )
});


// Mypage
app.post('/deleteroom', (req, res) => {
    console.log('deleteroom post'); // delete문 또는 삭제여부 표시
});

app.post('/deleteaccount', (req, res) => {
    console.log('deleteaccount post'); // delete문 또는 삭제여부 표시
});

// | room_id | room_name  | room_password | create_room_date    | user_id |