import React, { useState } from 'react';
// import { Button, Table,Modal } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'


const base64 = require('base-64');



const User = (props) => {
  const modalFuction = () => {
    console.log("model function called")
    alert('model callled');
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>

      <tr>
        
        <td><img style={{ width: '35px' }} src={props.avatarurls} /> </td>
        <td style={{ fontSize: '15px', fontWeight: 'bold', Width: '800px' }}>{props.name}</td>
        <td> {props.horizontalTotal} </td>

        {
          props.time.map(i =><td style={{ color: 'blue', cursor: 'pointer' }} onClick={handleShow}>{`${i}h`}</td>)
        }

      </tr>


    </>
  );


}

export default User;

// "5ddcbd17752c1b0d114e8cde"
// "5ddcbd17752c1b0d114e8cde"