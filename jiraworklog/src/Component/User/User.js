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
        {/* <Modal trigger={<Button>Show Modal</Button>}> */}
          <Modal.Header>Select a Photo</Modal.Header>
          <Modal.Content image>
            <img wrapped size='medium' src={props.avatarUrls} />
            <Modal.Description>
              <Header>Default Profile Image</Header>
              <p>
                We've found the following gravatar image associated with your e-mail
                address.
        </p>
              <p>Is it okay to use this photo?</p>
            </Modal.Description>
          </Modal.Content>
        {/* </Modal> */}
        <td><img style={{ width: '35px' }} src={props.avatarUrls} /> </td>
        <td style={{ fontSize: '15px', fontWeight: 'bold', Width: '800px' }}>{props.name}</td>
        {
          props.time.map(i =><Modal trigger= {<td style={{ color: 'blue', cursor: 'pointer' }} onClick={handleShow}>{`${i}h`}</td>}></Modal>)
        }

      </tr>


    </>
  );


}

export default User;

// "5ddcbd17752c1b0d114e8cde"
// "5ddcbd17752c1b0d114e8cde"