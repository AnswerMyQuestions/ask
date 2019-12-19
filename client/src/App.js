import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Main from './components/Main';
import Mypage from './components/Mypage';
import Chat from './components/Chat';
import JoinRoom from './components/JoinRoom';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/welcome" component={Welcome}></Route>
          <Route path="/main" component={Main}></Route>
          <Route path="/mypage" component={Mypage}></Route>
          <Route path="/chat" component={Chat}></Route>
          <Route path="/joinroom" component={JoinRoom}></Route>
        </Switch>
      </Router>
    )
  }
}

export default App;