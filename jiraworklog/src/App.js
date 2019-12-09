import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './Container/Login/Login';
import Timesheet from './Container/Timesheet/Timesheet';
import User from './Component/User/User';

class App extends Component {

  render() {
    let route = (
      <Switch>
        <Route exact path='/timesheet' component={Timesheet} />
        <Route path='/' component={Login} />
                {/* <Route path='/' component={User} /> */}

      </Switch>
    )

    return (
      <>
        {route}
      </>
    );
  }



}

export default App;