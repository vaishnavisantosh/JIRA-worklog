 import React from 'react';
 import {  Input } from 'semantic-ui-react-form-validator';

const InputHoc=(props)=>{
return(
    <>
    <Input fluid icon='user'
                iconPosition='left'
                placeholder='E-mail address'
                type="email"
                value={props.email}
                onChange={(e, { value }) => { this.setState({ email: value }) }}
                validators={['required']}
                errorMessages={['this field is required']}
                style={{ width: 400 }}

              />
</>
)}

const obj ={
    inputs : InputHoc
}

export default (WrappedComponent) => {
    return function wrappedRender(args){
        return <WrappedComponent {...obj}/>
    }
}
// export default Input;