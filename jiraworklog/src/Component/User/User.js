import React from 'react';
import { Button, Table } from 'react-bootstrap';

const base64 = require('base-64');

const User = (props) => {

    return (
        <tr >
            <td><img style={{width:'35px'}} src= {props.avatarUrls}/> </td>
            <td style={{fontSize:'15px',fontWeight:'bold'}}>{props.name}</td>
        </tr>
    );


}

export default User;