import React from 'react';
import { Button, Table } from 'react-bootstrap';

const base64 = require('base-64');

const User = (props) => {

    return (
        <tr>
            <td><img style={{width:'35px'}} src= {props.avatarUrls}/> </td>
            <td style={{fontSize:'15px',fontWeight:'bold',Width:'200px'}}>{props.name}</td>
            {
                props.time.map(i=><td key={i}>{i}</td>)
            }
        </tr>
    );


}

export default User;

// "5ddcbd17752c1b0d114e8cde"
// "5ddcbd17752c1b0d114e8cde"