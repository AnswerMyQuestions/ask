import React from 'react';
import { Link, Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import './App.css';

class App extends React.Component {
  render() {
    return(
      <Router>
        <Link to="/"></Link>
        <Link to="/login"></Link>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/login" component={Login}></Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
