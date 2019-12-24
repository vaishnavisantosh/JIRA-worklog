import React, { useState } from 'react';
// import { Button, Table,Modal } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
import { Button, Header, Icon, Modal, Image } from 'semantic-ui-react'


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
        <td style={{ color: 'black', fontWeight: 'bold' }}> {props.horizontalTotal} </td>



        {
          props.time.map(i =>
            <>
              {/* {
            i!=0.00 ?
          <td  style={{ color: 'blue', cursor: 'pointer' }} >{`${i}h`}</td>
          : <td  style={{ color: 'grey' }} >{`${i}h`}</td> } */}
              <Modal trigger={

                <td style={{ color: i != 0.00 ? 'blue' : 'grey', cursor: i != 0.00 ? 'pointer' : '' }}>{`${i}h`}</td>} centered={false}>
                <Modal.Header>Worklogs</Modal.Header>
                <Modal.Content>
                  {
                    <>
                      <img style={{ width: '35px' }} src={props.avatarurls} />
                      <td style={{ color: i != 0.00 ? 'blue' : 'grey', cursor: i != 0.00 ? 'pointer' : '' }} >{`${i}h`}</td>
                      <p>{props.comments}</p>
                    </>}
                </Modal.Content>
              </Modal>
            </>

          )
        }


      </tr>


    </>
  );


}

export default User;

