import React, { Component } from 'react';
import logo from './ask_logo.png';
//import add_btn from './add_btn.svg';
import SEND from './send_btn.svg';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';
import Input from '@material-ui/core/Input';
import { Route, Link } from 'react-router-dom';
import { withStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { MenuItem } from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
//import './Drawer_togglebutton.css';
//import Drawer_togglebutton from './SideDrawer/Drawer_togglebutton';
//import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
//import 'react-chat-widget/lib/styles.css';
//import AppChannel from './module/channel/channel';
//import AppChattingView from './module/chattingView/chattingView';

// logo color => rgb: 165 0 33, hex: #a50021
const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#ffffff'
  },
  toolbar: {
    justifyContent: 'space-between',
    backgroundColor: '#000000'
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    color: '#ffffff'
  },
  body: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    color: '#ffffff',
    position: 'absolute', left: 0, right: 0, bottom: 10
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
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "red !important"
  },
  send_btn: {
    backgroundColor: '#a50021',
    color: '#ffffff',
    '&:hover': {
      background: '#a50021'
    },
    fontSize: 20,
    marginLeft: 10
  },
  back_btn: {
    color: 'a50021',
    fontSize: 20,
    marginLeft: 10
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  }
})

class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      open: false,
      show: null,
      doRedirect: false
    }
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    // this.join()
    //   .then(response => {
    //     console.log(response);
    //   })

    this.setState({
      message: '',
      open: false,
      doRedirect: true
    })
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

  handleToggle = () => this.setState({ open: !this.state.open })

  render() {
    const { classes } = this.props; //초기화

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <AppBar position="static" onRightIconButtonCLick={this.handleToggle}>
            <Toolbar className={classes.toolbar}>
              <Button color="inherit">이전</Button>
              <Typography variant="h6" className={classes.title}>
                방이름
              </Typography>
              <IconButton edge="start" className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={this.handleOpen}>
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>

        <div className={classes.body}>
          <form className={classes.message}>

            <TextField type="text" name="message" mx="auto" className={classes.textField} placeholder="질문을 입력하세요. " fullWidth value={this.state.message} onChange={this.handleValueChange} variant="outlined" multiline style={{ width: 1400 }} InputProps={{
              classes: {
                notchedOutline: classes.notchedOutline
              }
            }}>
            </TextField>

            <Button variant="contained" className={classes.send_btn} endIcon={<SvgIcon>
              <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
            </SvgIcon>} style={{ height: 55 }} onClick={this.handleFormSubmit}>
              보내기
            </Button>
          </form>
        </div>
        <Drawer className={classes.drawer} variant="persistent" anchor="right" docked={false} width={200} open={this.state.open}
          onRequestChange={(open) => this.setState({ open })} 
          classes={{
            paper: classes.drawerPaper,
          }}>
           <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleClose} Icon={
            <KeyboardArrowLeftIcon className={classes.back_btn}/>
          }>            
          </IconButton>
        </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(Chat);