import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import SvgIcon from '@material-ui/core/SvgIcon';
import Drawer from '@material-ui/core/Drawer';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import queryString from 'query-string';
import io from 'socket.io-client';
import Messages from './Messages';

import './Chat.css'

let socket;

// logo color => rgb: 165 0 33, hex: #a50021

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);

  const endpoint = 'https://askaskask.herokuapp.com/';
  // const endpoint = 'localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    // socket = io(endpoint, {transports: ['websocket']});
    socket = io(endpoint);

    setName(name);
    setRoom(room);

    socket.emit('join room', { name, room }, () => {
      
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [endpoint, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      console.log("message on 함수");
      setMessages([...messages, message]);
      console.log(messages, message);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [messages]);

  // 메세지 보내기 함수
  const sendMessage = (event) => {
    event.preventDefault()

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  const handleValueChange = (e) => {
    setMessage(e.target.value);
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    sendMessage(e);
    setMessage('');
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }
  
  return (
    <div className="root">
      <div className="header">
        <AppBar position="static">
          <Toolbar className="toolbar">
            <Button color="inherit">이전</Button>
            <Typography variant="h6" className="title">
              {room}
            </Typography>
            <IconButton className="menuButton"
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleOpen}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>

      <div className="body">
        <form className="message">
          <TextField type="text" name="message" mx="auto" className="textField" placeholder="질문을 입력하세요. " fullWidth value={message} onChange={handleValueChange} variant="outlined" multiline style={{ width: 1400 }} InputProps={{}} onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}></TextField>
          <Button variant="contained" className="send_btn" endIcon={<SvgIcon><path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" /></SvgIcon>} style={{ height: 55 }} onClick={handleFormSubmit}>
            보내기
          </Button>
        </form>
        <Messages messages={messages} name={name} />
      </div>
      <Drawer className="drawer" variant="persistent" anchor="right" docked="false" width={200} open={open}
        classes={{ paper: "drawerPaper" }}>
        <div className="drawerHeader">
          <IconButton onClick={handleClose} icon={<KeyboardArrowLeftIcon className="back_btn"/>} />            
        </div>
        {
          users
          ? (
            <div>
              <h1>현재 채팅방에 있는 사람들</h1>
              <h2>
                {users.map(({name}) => (
                  <div key={name}>
                    {name}
                  </div>
                ))}
              </h2>
            </div>
           
          )
          : null
        }
      </Drawer>
    </div>
  );
}

export default Chat;