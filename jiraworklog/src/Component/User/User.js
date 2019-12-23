import React,{useState} from 'react';
// import { Button, Table,Modal } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'


const base64 = require('base-64');



const User = (props) => {
   const modalFuction=()=>{
        console.log("model function called")
        alert('model callled');
    }
  
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
        
        <tr>
            <td><img style={{width:'35px'}} src= {props.avatarUrls}/> </td>
            <td style={{fontSize:'15px',fontWeight:'bold',Width:'800px'}}>{props.name}</td>
            {
                props.time.map(i=><td style={{color:'blue',cursor:'pointer'}} onClick={handleShow}>{`${i}h`}</td>)
            }
            
        </tr>

        <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>WorkLog</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>
        </>
    );


}

export default User;

// "5ddcbd17752c1b0d114e8cde"
// "5ddcbd17752c1b0d114e8cde"