import React from 'react';
import logo from './ask_logo.png';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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
  welcome: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    color: '#ffffff'
  },
  login_btn: {
    backgroundColor: '#a50021',
    color: '#ffffff',
    '&:hover': {
      background: '#a50021'
    },
    alignItems: 'center'
  }
})

class Welcome extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>

        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <img src={logo} alt="logo" className={classes.image} />
          </Toolbar>
        </AppBar>

        <div className={classes.welcome}>
          <form>
            <h2>회원가입이 완료되었습니다!</h2>
            <div>로그인 하시려면 아래 버튼을 눌러주세요. </div><br />
            <Button variant="contained" className={classes.login_btn} href="/Login">로그인 하기</Button>
          </form>
        </div>
      </div>
    )
  }

}

export default withStyles(styles)(Welcome);