import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Header, Segment } from 'semantic-ui-react'
import { Form, Input } from 'semantic-ui-react-form-validator';
import 'semantic-ui-css/semantic.min.css';

const base64 = require('base-64');

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
    let arr=[];
    try{
    let res = await fetch(`${this.state.apiurl}/rest/api/2/user/assignable/search?project=REAC`, { method: 'GET', headers: headers });
    res = res.json();
    localStorage.setItem('api',this.state.apitoken);
    localStorage.setItem('url',this.state.apiurl);
    localStorage.setItem('email',this.state.email);

    // console.log('inside try');
    this.props.history.push('/timesheet');
        // .then(res => res.json())
        // .then(res => {
        //   if(res.length<=0){
        //     console.log('credientials are not correct!');
        //   }
        //   else{
        //     for(let key in res){
        //         arr.push({
        //             id:res[key].accountId,
        //             avatarUrls:Object.values(res[key].avatarUrls)[3],
        //             name:res[key].displayName

        //         });
        //       }
        //     }
        //     console.log("response", res);
        //     console.log("user array",arr)
        //     this.setState({user:arr})
        //     console.log("state",this.state.user);
        //     this.props.history.push('/timesheet');


        // }

        // );
      
      }
        catch(error){
          console.log("worng crediential",error)
        }
}



 

 
  
  render() {
    let { email, apitoken, apiurl } = this.state;
    let LoginForm =
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