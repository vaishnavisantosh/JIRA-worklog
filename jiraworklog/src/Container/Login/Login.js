import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Header, Segment, Message } from 'semantic-ui-react'
import { Form} from 'semantic-ui-react-form-validator';
import Api from '../../utility';
import {emailObject,passwordObject,urlObject} from '../../Constants';
import InputHoc from '../../Hoc/FormInput/input';

class Login extends Component {
state = {
  email: "",
  apitoken: "",
  apiurl: "",
  errorMsg: false
}

  fetchData = async () => {
    const { email, apitoken, apiurl } = this.state;
    localStorage.setItem('apiToken', apitoken)
    localStorage.setItem('url', apiurl)
    localStorage.setItem('email', email)

    try {
       await Api.apicall(`${apiurl}/rest/api/2/project`)
      .then(response=>
        { if (response.length > 0){
          localStorage.clear();
          localStorage.setItem('apiToken', apitoken)
          localStorage.setItem('url', apiurl)
          localStorage.setItem('email', email)
          this.props.history.push('/timesheet')

        }}
      )
      
    } catch (error) {
      this.setState({ errorMsg: true })
    }
  }

  onChangehandler=(inputValue,event)=>{
    this.setState({ [inputValue]: event.target.value }) }

  render() {
    const {errorMsg } = this.state;
    const {inputs}=this.props;
    const LoginForm =
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='blue' textAlign='center'>
            Log-in to your account
          </Header>
          <Form size='large'
            onSubmit={this.fetchData}>
            <Segment stacked>
             {inputs({...emailObject,onChange:(event)=> this.onChangehandler("email", event),value:this.state.email})}
              {inputs({...urlObject,onChange:(event)=>this.onChangehandler("apiurl",event),value:this.state.apiurl})}
              {inputs({...passwordObject,onChange:(event)=>this.onChangehandler("apitoken",event),value:this.state.apitoken})}
              {errorMsg ? <Message>Credientials not correct</Message> : null}

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

export default  InputHoc(withRouter(Login));