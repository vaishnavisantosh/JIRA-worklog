import React from 'react';
import { Input } from 'semantic-ui-react-form-validator';

const InputHoc = (props) => {
    return (
        <>
            <Input fluid 
                icon={props.icon}
                placeholder={props.placeholder}
                type={props.type}
                value={props.value}
                onChange={ props.onChange}
                validators={['required']}
                errorMessages={['this field is required']}
                iconPosition='left'
                style={{ width: 400 }}
            />
        </>
    )
}

const objectStore = { inputs: InputHoc }

export default (WrappedComponent) => {
    return function wrappedRender(args) {
        return <WrappedComponent {...objectStore} />
    }
}
