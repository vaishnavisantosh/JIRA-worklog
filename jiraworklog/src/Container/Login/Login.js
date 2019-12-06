import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Header, Segment } from 'semantic-ui-react'
import { Form, Input } from 'semantic-ui-react-form-validator';
import 'semantic-ui-css/semantic.min.css';

// import config from '../../config.json';

// var fs=require('fs');
class Login extends Component {

  state = {
    email: "",
    apitoken: "",
    apiurl: ""
  }

  credientialobject = {
    "apiurl": "https://vaishnavijawanjal.atlassian.net",
    "email": "vaishnavi.jawanjal@cuelogic.com",
    "apiToken": "76cUIpriuCh9iNmcdrWe07D4"
  }

  // nconf.file('../../config.json');

  gotoTimesheet = () => {

    if (this.state.email === this.credientialobject.email && this.state.apitoken === this.credientialobject.apiToken && this.state.apiurl === this.credientialobject.apiurl) {
      this.props.history.push('/timesheet');

    }
    else {
      alert('email or password or apiurl not correct')
    }
    // nconf.file('../../config.json');
    //console.log(nconf.get(all))

  }
  
  render() {
    let { email, apitoken, apiurl } = this.state;
    let LoginForm =
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='blue' textAlign='center'>
            Log-in to your account
          </Header>
          <Form size='large' onSubmit={this.gotoTimesheet}>
            <Segment stacked>
              <Input fluid icon='user'
                iconPosition='left'
                placeholder='E-mail address'
                type="email"
                value={email}
                onChange={(e, { value }) => { this.setState({ email: value }) }}
                validators={['required']}
                errorMessages={['this field is required']}
                style={{ width: 400 }}

              />
              <Input fluid icon='user'
                iconPosition='left'
                placeholder='JIRA url'
                value={apiurl}
                validators={['required']}
                onChange={(e, { value }) => { this.setState({ apiurl: value }) }}
                errorMessages={['this field is required']}
                style={{ width: 400 }}

              />
              <Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='API token'
                type='password'
                value={apitoken}
                onChange={(e, { value }) => { this.setState({ apitoken: value }) }}
                validators={['required']}
                errorMessages={['this field is required']}
                style={{ width: 400 }}

              />
              <Button color='blue' fluid size='large'>
                Login
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
      
      return (
      <>
        {LoginForm}
      </>
    );
  }
}



export default withRouter(Login);