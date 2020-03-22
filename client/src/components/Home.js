import React from 'react';
import logo from './ask_logo.png';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import  axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

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
  login_btn: {
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255)'
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  page_explaination: {
    width: '500px',
    color: '#ffffff'
  },
  howto_btn: {
    backgroundColor: '#a50021',
    color: '#ffffff',
    '&:hover': {
      background: '#a50021'
    }
  },
  howtoclosing_btn: {
    color: '#a50021'
  },
  textField: {
    '& .MuiInputBase-root': {
      color: '#ffffff'
    },
    '& .MuiFormLabel-root': {
      color: '#ffffff'
    },
    '& .MuiInput-underline:before': {
      borderBottom: '1px solid rgb(255, 255, 255)'
    },
    '& .MuiInput-underline:after': {
      borderBottom: '1px solid rgb(165, 0, 33)'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: '1px solid rgb(165, 0, 33)'
    }
  },
  signup_btn: {
    backgroundColor: '#a50021',
    color: '#ffffff',
    '&:hover': {
      background: '#a50021'
    }
  },
})

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      member: '',
      username: '',
      email: '',
      password: '',
      open: false,
      doRedirect: false
    }
  }

  handleOpen = () => {
    this.setState({
      open: true
    })
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

  handleFormSubmit = (e) => {
    e.preventDefault()
    const user = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post('/join', user)
      .then(res => console.log(res.data));

    this.setState({
      member: '',
      username: '',
      email: '',
      password: '',
      open: false,
      doRedirect: true
    })

  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>

        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <img src={logo} alt="logo" className={classes.image} />
            <Button variant="outlined" className={classes.login_btn} href="/login">
              로그인
            </Button>
          </Toolbar>
        </AppBar>

        <div className={classes.body}>
          <div className={classes.page_explaination}>
            <div>아스크</div>
            <div>
              다른 사람들 앞에서 질문하기 어려워 하는 사람들을 위한 채팅 프로그램.
              질문 시간이 주어지면 질문하지 않지만 따로 찾아가거나 채팅 메신저로는
              많은 질문을 하는 당신! 모르는 것이 부끄러운 것이 아니라는 것을 머리로는 알지만
              다른 사람들 앞에서 질문하기 어려운 당신! 이 프로그램을 쓰세요! 사용방법을
              알고 싶으시면 아래 버튼을 눌러주세요.
              </div>
            <div>
              <Button variant="contained" className={classes.howto_btn} onClick={this.handleOpen}>
                사용방법
                </Button>
              <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>{"아스크 사용방법"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    1. 이렇게 하세요.<br />
                    2. 저렇게 하세요.<br />
                    3. 네네 그겁니다.<br />
                    4. 네네 바로 그겁니다.<br />
                    5. 이해하셨나요?<br />
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="outlined" onClick={this.handleClose} className={classes.howtoclosing_btn}>닫기</Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>

          <form>
            <TextField type="text" name="username" label="사용자 이름" value={this.state.username} onChange={this.handleValueChange} className={classes.textField} /><br />
            <TextField type="text" name="email" label="이메일" value={this.state.email} onChange={this.handleValueChange} className={classes.textField} /><br />
            <TextField type="password" name="password" label="비밀번호" value={this.state.password} onChange={this.handleValueChange} autoComplete="current-password" className={classes.textField} /><br />

            <Button variant="contained" className={classes.signup_btn} onClick={this.handleFormSubmit}>
              회원가입
            </Button>
            {/* { this.state.doRedirect && <Redirect to="/welcome" />} */}
          </form>
        </div>

      </div>
    );
  }
}

export default withStyles(styles)(Home);
