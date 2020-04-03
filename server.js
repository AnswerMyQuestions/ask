  
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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

    if (error) return callback(error);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!` });

    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('disconnect', () => {
    console.log('User had left');
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` });
    }
  });
});

// app.use(allowCrossDomain);  

/*
 * 라우터 분리 
 */

// Home
app.get('/join', (req, res) => {
  console.log('join get')
});

app.post('/join', async (req, res) => {
  console.log('join post'); // insert문
  console.log(req.body);

  if ((req.body.username == '') || (req.body.email == '') || (req.body.password == '')) res.redirect('/');
  else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let sql = "INSERT INTO USER(user_name, user_email, user_password, create_user_date) VALUES (?, ?, ?, now())";

    let username = req.body.username;
    let email = req.body.email;
    let password = hashedPassword;
    let params = [username, email, password];
    dbConnection.query(sql, params,
      (err, rows, fields) => {
        if (err) console.log("join error" + err);
        else res.send(rows);
      });
  }
});

// Login
app.get('/signin', (req, res) => {
  console.log('signin get');
});

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.user_id);
});
passport.deserializeUser((id, done) => {
  console.log(id)
  done(null, id);
});


passport.use('local', new LocalStrategy({
    usernameField: 'useremail',
    passwordField: 'userpw',
   }, async (email, password, done) => {
        console.log(email, password);
        let sql = "SELECT * FROM USER WHERE user_email=?";
        let param = [email];
        dbConnection.query(sql, param,
          async (err, rows, fields) => {
              if(err) console.log("authenticationUser error" + err);
              if(rows.length == 0) {
                  console.log('No user with that email');
                  return done(null, false, { message: 'No user with that email' });
              }
              try {
                  if(await bcrypt.compare("" + password, "" + rows[0].user_password)) {
                    console.log('correct!!! return rows[0]');
                    var json = JSON.stringify(rows[0]);
                    var res = JSON.parse(json);
                    return done(null, res);  
                    // return done(null, rows[0]);
                  } else {
                    console.log('password incorrect');
                      return done(null, false, { message: 'Password incorrect' });
                  }
              } catch(e) {
                  return done(e);
              }
      });
  }));

app.post('/signin', (req, res, next) => {
  console.log('signin post')
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.json({ success: false });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ data: user.user_name, success: true });
    });
  })(req, res, next)
});

// Logout
app.get('/signout', (req, res) => {
  console.log('signout get');
  req.logout();
  res.redirect('/login');
});

// Main
app.get('/createroom', (req, res) => {
  console.log('createroom get');
});

app.post('/createroom', (req, res) => {
  console.log('createroom post');
  //console.log(req.body);

  let sql = "INSERT INTO ROOM(room_name, room_password, create_room_date, user_id) VALUES (?, ?, now(), ?)";

  let roomname = req.body.roomname;
  let roompassword = req.body.roompassword;
  let roomowner = req.body.roomowner;
  let params = [roomname, roompassword, roomowner];
  dbConnection.query(sql, params,
    (err, rows, fields) => {
      if (err) console.log("createroom error" + err);
      else res.send(rows);
    });
});

app.get('/rooms', (req, res) => {
  console.log('rooms get');
  let sql = "SELECT room_id, room_name, user_name from ROOM, USER where ROOM.user_id = USER.user_id;";
  dbConnection.query(sql,
    (err, rows, fields) => {
      if (err) console.log("rooms error" + err);
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

//로그인이 되지 않은 상태면 다른 url에는 갈 수 없음.
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login');
}

//로그인이 된 상태이면 어떤 url을 입력해도 /main에만 있을 수 있도록 만든다.
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/main');
  }
  next()
}

// | room_id | room_name  | room_password | create_room_date    | user_id |