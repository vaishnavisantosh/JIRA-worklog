import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Header, Segment } from 'semantic-ui-react'
import { Form, Input } from 'semantic-ui-react-form-validator';
import 'semantic-ui-css/semantic.min.css';

import base64 from 'base-64';
class Login extends Component {

  state = {
    email: "",
    apitoken: "",
    apiurl: ""
  }

  fetchData = async () => {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append('Authorization', 'Basic ' + base64.encode(`${this.state.email}:${this.state.apitoken}`));
    
    try {
      const response = await fetch(`${this.state.apiurl}/rest/api/2/project`, { method: 'GET', headers: headers });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      localStorage.setItem('api', this.state.apitoken)
      localStorage.setItem('url', this.state.apiurl)
      localStorage.setItem('email', this.state.email)
      this.props.history.push('/timesheet')
    } catch (error) {
      alert('credientials are not correct!')
    }
  }
  render() {

    const { email, apitoken, apiurl } = this.state;

    const LoginForm =
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='blue' textAlign='center'>
            Log-in to your account
          </Header>
          <Form size='large'
            onSubmit={this.fetchData}>
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