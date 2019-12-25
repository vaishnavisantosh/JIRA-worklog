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
                   

              {/* {
            i!=0.00 ?
          <td  style={{ color: 'blue', cursor: 'pointer' }} >{`${i}h`}</td>
          : <td  style={{ color: 'grey' }} >{`${i}h`}</td> } */}
         { i!=0.00?
         
         <>
              <Modal style={{width:'60%',height:'30%',margin:'10px 0px 0px 200px'}} trigger={

                <td style={{ color: i != 0.00 ? 'blue' : 'grey', cursor: i != 0.00 ? 'pointer' : '' }}>{`${i}h`}</td>} centered={true}>
                <Modal.Header>Worklogs</Modal.Header>
                <Modal.Content>
                  {
                    
                    <>
                      <img style={{ width: '35px',float:'right' }} src={props.avatarurls} />
                      <td style={{ color: i != 0.00 ? 'blue' : 'grey', cursor: i != 0.00 ? 'pointer' : '' }} >{`${i}h`}</td>
                        {/* <>{ i=props.comments.map((i) => <p>{i}</p>) */}
                  {props.comments.map((comment,cindex)=>cindex===index?<p>{comment}</p>:null)}


                      {/* {props.comments.map(comment,cindex)=} */}
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

