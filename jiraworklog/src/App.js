import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Container/Login/Login';

const Timesheet = React.lazy(() => import('./Container/Timesheet/Timesheet'));
class App extends Component {
  render() {
    const route = (
      <Switch>
        <Route exact path='/timesheet' render={() => <Timesheet />} />
        <Route path='/' component={Login} />
      </Switch>
    )
    return (
      <>
        <Suspense fallback={<p>Loading................!!</p>}>
          {route}
        </Suspense>
      </>
    );
  }
}

export default App;