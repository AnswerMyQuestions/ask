import React from 'react';
import logo from './ask_logo.png';
import avatar from './avatar.png'
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

// logo color => rgb: 165 0 33, hex: #a50021

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)'
  },
  toolbar: {
    justifyContent: 'space-between',
    backgroundColor: '#000000'
  },
  image: {
    flexGrow: 1,
    maxWidth: 100,
    paddingTop: 6
  },
  logout_btn: {
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255)'
  },
  deleteroom_btn: {
    backgroundColor: '#a50021',
    color: '#ffffff',
    '&:hover': {
      background: '#a50021'
    }
  },
  deleteroomclosing_btn: {
    color: '#a50021'
  },
  deleteaccount_btn_display: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  deleteaccount_btn: {
    backgroundColor: '#a50021',
    color: '#ffffff',
    '&:hover': {
      background: '#a50021'
    }
  },
  deleteaccountclosing_btn: {
    color: '#a50021'
  },
  deleteaccount_btn: {
    backgroundColor: '#a50021',
    color: '#ffffff',
    '&:hover': {
      background: '#a50021'
    }
  },
  body: {
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center'
    textAlign: 'center',
  },
  edit_userinfo: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '500px',
    color: '#ffffff'
  },
  textField: {
    '& .MuiInputBase-root': {
      color: '#000000'
    },
    '& .MuiFormLabel-root': {
      color: '#000000'
    },
    '& .MuiInput-underline:before': {
      borderBottom: '1px solid rgb(0, 0, 0)'
    },
    '& .MuiInput-underline:after': {
      borderBottom: '1px solid rgb(165, 0, 33)'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: '1px solid rgb(165, 0, 33)'
    }
  }
})

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roompassword: '',
      password: '',
      open: false
    }
  }

  /*
  *
  * componenetDidMount, callApi 만든다면 Room이랑 Account 따로 만들어야되나?
  * handleRoomFormSubmit과 handleAccountFormSubmit this.setState에 open을 넣어야하나?
  * handleValueChange도 Room과 Account 따로 만들어야되나?
  * 
  */

  handleOpen = () => {
    this.setState({
      open: true
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleRoomFormSubmit = (e) => {
    e.preventDefault();
    this.deleteRoom()
      .then(response => console.log(response));

    this.setState({
      roompassword: ''
    });
  }

  handleAccountFormSubmit = (e) => {
    e.preventDefault();
    this.deleteAccount()
      .then(response => console.log(response));
    this.setState({
      password: ''
    });
  }

  deleteRoom = () => {
    const url = "/deleteroom";
    const formData = new FormData();
    formData.append("roompassword", this.state.roompassword);

    return postMessage(url, formData);
  }

  deleteAccount = () => {
    const url = "/deleteaccount";
    const formData = new FormData();
    formData.append("password", this.state.password);

    return postMessage(url, formData);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>

        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <img src={logo} alt="logo" className={classes.image} />
            <Button variant="outlined" href="/" className={classes.logout_btn}>
              로그아웃
              </Button>
          </Toolbar>
        </AppBar>

        <div className={classes.body}>
          <div>
            <Avatar alt="avatar" src={avatar} />
          </div>
          <div className={classes.edit_userinfo}>
            <div>
              <p>내가 만든 방</p>
              {/* 
                    **
                    ** 반복문으로 바꾸기
                    ** 
                    */}
              1. 이것이 방이다.
                    <Button variant="contained" className={classes.deleteroom_btn} onClick={this.handleOpen}>삭제</Button>
              <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>{"방 삭제"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    정말 방을 삭제하실건가요?<br />
                    삭제하고 싶으면 방 비밀번호를 입력하세요<br />
                    <form>
                      <TextField type="text" name="roompassword" label="방 비밀번호" value={this.state.roompassword} onChange={this.handleValueChange} className={classes.textField} /><br />
                    </form>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="outlined" onClick={this.handleClose} className={classes.deleteroomclosing_btn}>닫기</Button>
                  <Button variant="contained" onClick={this.handleFormSubmit} className={classes.deleteroom_btn} onClick={this.handleRoomFormSubmit}>삭제</Button>
                </DialogActions>
              </Dialog>
              <br />

              2. 저것이 방이다.
                    <Button variant="contained" className={classes.deleteroom_btn}>삭제</Button>
              <br />
            </div>
            <div>
              <p>내가 들어간 방</p>
              1. 이것이 내가 들어간 방이다. <br />
              2. 저것이 내가 들어간 방이다. <br />
            </div>
          </div>
        </div>
        <div className={classes.deleteaccount_btn_display}>
          <Button variant="contained" className={classes.deleteaccount_btn} onClick={this.handleOpen}>탈퇴</Button>
          <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle>{"계정 삭제"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                정말 계정을 삭제하실건가요?<br />
                삭제하고 싶으면 계정 비밀번호를 입력하세요<br />
                <form>
                  <TextField type="text" name="password" label="계정 비밀번호" value={this.state.password} onChange={this.handleValueChange} className={classes.textField} /><br />
                </form>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={this.handleClose} className={classes.deleteaccountclosing_btn}>닫기</Button>
              <Button variant="contained" onClick={this.handleFormSubmit} className={classes.deleteaccount_btn} onClick={this.handleAccountFormSubmit}>삭제</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Main);
