import React from 'react';
import logo from './ask_logo.png';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import  axios from 'axios';
import { Redirect } from 'react-router-dom';
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
  home_btn: {
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255)'
  },
  head: {
    display: 'flex',
    justifyContent: 'center',
    color: '#ffffff'
  },
  login: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  login_btn: {
    backgroundColor: '#a50021',
    color: '#ffffff',
    '&:hover': {
      background: '#a50021'
    }
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
  }
})

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      username: '',
      useremail: '',
      userpw: '',
      doRedirect: false
    }
  }

/*  
  componentDidMount() {
    this.callApi()
      .then(res => 
        this.setState({ user: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/signin');
    const body = await response.json();
    return body;
  }
*/

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleFormSubmit = (e) => {
    e.preventDefault()

    const user = {
      useremail: this.state.useremail,
      userpw: this.state.userpw,
    };

    console.log(user);

    axios
      .post('/signin', user)
      .then(res => {
        console.log(res)
        this.setState({
          username: res.data.data,
          doRedirect: res.data.success
        });
        console.log(this.state.doRedirect);
      }).catch(err => console.log(err));
    
    /*  
    this.setState({
      user: '',
      useremail: '',
      userpw: '',
      doRedirect: true
    })
    */
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <img src={logo} alt="logo" className={classes.image} />
            <Button variant="outlined" className={classes.home_btn} href="/">
              홈
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.head}>
          <h2>웰컴 투 로그인 페이지</h2>
        </div>
        <div className={classes.login}>
          <form>
            <TextField type="text" name="useremail" label="아이디" value={this.state.useremail} onChange={this.handleValueChange} className={classes.textField} /><br />
            <TextField type="password" name="userpw" label="비밀번호" value={this.state.userpw} onChange={this.handleValueChange} className={classes.textField} /><br />
            <Button variant="contained" className={classes.login_btn} onClick={this.handleFormSubmit}>로그인</Button>
          </form>
          { this.state.doRedirect && <Redirect to={{ pathname: "/main", state: { username: this.state.username } }}/> }
        </div>
      </div>
    )
  }

}

export default withStyles(styles)(Login);