import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Header, Segment,Message } from 'semantic-ui-react'
import { Form, Input } from 'semantic-ui-react-form-validator';
import axios from 'axios';
// import inputHoc from '../../Hoc/input';
import 'semantic-ui-css/semantic.min.css';

import base64 from 'base-64';
class Login extends Component {

  state = {
    email: "",
    apitoken: "",
    apiurl: "",
    errorMsg:false
  }

  fetchData = async () => {
    const {email,apitoken,apiurl}=this.state;
    const headers = {Authorization:'Basic '+base64.encode(`${email}:${apitoken}`),'Content-Type':'application/json',Accept:'application/json'}
    
    try {
      const response = await axios.get(`${apiurl}/rest/api/2/project`, {headers });
      // 
      if(response.data.length>0)
      localStorage.setItem('apiToken', apitoken)
      localStorage.setItem('url', apiurl)
      localStorage.setItem('email',email)
      this.props.history.push('/timesheet')
    } catch (error) {
      this.setState({errorMsg:true})
      
    }
  }
  render() {
    // debugger;
    // const object={
    //   placeholder:'E-mail address'
    // }
    const { email, apitoken, apiurl,errorMsg } = this.state;
  //  console.log(this.props)
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
              { errorMsg ?<Message>Credientials not correct</Message>:null}
              {/* {this.props.inputs(email)} */}
              
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