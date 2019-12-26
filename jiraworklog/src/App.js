import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Container/Login/Login';
import Timesheet from './Container/Timesheet/Timesheet';

class App extends Component {

  render() {
    let route = (
      <Switch>
        <Route exact path='/timesheet' component={Timesheet} />
        <Route path='/' component={Login} />
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