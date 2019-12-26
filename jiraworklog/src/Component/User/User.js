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
let comment;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>

      <tr>

        <td><img style={{ width: '35px' }} src={props.avatarurls} /> </td>
        <td style={{ fontSize: '15px', fontWeight: 'bold', Width: '800px' }}>{props.name}</td>
        <td style={{ color: 'black', fontWeight: 'bold' }}> {`${props.horizontalTotal}h`} </td>



        {
          props.time.map((i,index) =>
            <>
                   

              
         { i!=0.00?
         
         <>
              <Modal onClose={handleClose} style={{width:'70%',height:'40%',margin:'10px 0px 0px 200px'}} trigger={

                <td style={{ color: i != 0.00 ? 'blue' : 'grey', cursor: i != 0.00 ? 'pointer' : '' }}>{`${i}h`}</td>} centered={true}>
                <p style={{fontWeight: 'bold',margin: '10px',fontSize: 'large'}}>Worklogs</p>
                <Modal.Content>
                  {
                    
                    <>
                    <p style={{display:'inline',margin:'0px 600px 0px 0px'}}>comment</p>
                    <p style={{display:'inline'}}>Time spent</p>
                    <hr/>
                    {props.comments.map((comment,cindex)=>cindex===index?<p style={{display:'inline-block'}}>{`-${comment}`}</p>:null)}
                    <p style={{ color: 'gray',display:'inline',float:'right',margin:'0px 160px 0px 0px' }} >{`${i}h`}</p>
                      <img style={{ width: '35px',float:'right',margin: '-5px -95px 0px 0px' }} src={props.avatarurls} />
                      
                      <hr/>
                  
                    <Button color='teal' >close</Button>

                      
                    </>}
                </Modal.Content>
              </Modal>
                    </>:  <td  style={{ color: 'grey'}} >{`${i}h`}</td>
                  }
                  </>
          )
        }


      </tr>


    </>
  );


}

export default User;

