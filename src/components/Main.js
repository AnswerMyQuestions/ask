import React from 'react';
import logo from './ask_logo.png';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { fade, withStyles } from '@material-ui/core/styles';

// logo color => rgb: 165 0 33, hex: #a50021

/*
*
* https://material-ui.com/components/grid-list/
*
*/

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
  mypage_btn: {
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255)'
  },
  body: {
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'space-around'
  },
  createandsearchroom: {
    width: '500px',
    color: '#ffffff'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  addroom_btn: {
    backgroundColor: '#a50021',
    color: '#ffffff',
    '&:hover': {
      background: '#a50021'
    }
  },
  addroomclosing_btn: {
    color: '#a50021'
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
      room: '',
      roomname: '',
      roompassword: '',
      roomowner: '',
      open: false
    }
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ room: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('./createroom');
    const body = await response.json();
    return body;
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
    this.createroom()
      .then(response => console.log(response))

    this.setState({
      roomname: '',
      roompassword: '',
      roomowner: ''
    });
  }

  createroom = () => {
    const url = './createroom';
    const formData = new FormData();
    formData.append('roomname', this.state.roomname);
    formData.append('roompassword', this.state.roompassword);
    formData.append('roomowner', this.state.roomowner);

    return postMessage(url, formData);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>

        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <img src={logo} alt="logo" className={classes.image} />
            <div>
              <Button variant="outlined" className={classes.logout_btn} href="/">
                로그아웃
                </Button>
              <Button variant="outlined" className={classes.mypage_btn} href="/mypage">
                마이 페이지
                </Button>
            </div>
          </Toolbar>
        </AppBar>

        <div className={classes.body}>
          <div className={classes.createandsearchroom}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <div>
              <Button variant="contained" onClick={this.handleOpen} className={classes.addroom_btn}>+</Button>
              <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>{"방만들기"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <form>
                      <TextField type="text" name="roomname" label="방 이름" value={this.state.roomname} onChange={this.handleValueChange} className={classes.textField} /><br />
                      <TextField type="text" name="roompassword" label="방 비밀번호" value={this.state.roompassword} onChange={this.handleValueChange} className={classes.textField} /><br />
                      <TextField type="text" name="roomowner" label="방 주인" value={this.state.roomowner} onChange={this.handleValueChange} className={classes.textField} /><br />
                    </form>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="outlined" onClick={this.handleClose} className={classes.addroomclosing_btn}>취소</Button>
                  <Button variant="contained" onClick={this.handleFormSubmit} className={classes.addroom_btn}>만들기</Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>


        </div>

      </div>
    );
  }
}

export default withStyles(styles)(Main);
