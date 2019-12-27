import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react'
import moment from 'moment';
import './User.css';


const User = (props) => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <tr>
        <td><img style={{ width: '35px' }} src={props.avatarurls} alt='avatarImage' /> </td>
        <td style={{ fontSize: '15px', Width: '800px' }}>{props.name}</td>
        <td style={{ color: 'black', fontWeight: 'bold', borderRight: '1px solid rgba(211,211,211, 0.8)' }}> {`${props.horizontalTotal}h`} </td>

        {
          props.time.map((i, index) =>
            <>
              {i !== '0.00' ?
                <>
                  <Modal onOpen={handleShow} open={show} style={{ width: '70%', height: '40%', margin: '10px 0px 0px 200px' }} trigger={

                    <td style={{ color: i !== '0.00' ? 'blue' : 'grey', cursor: i !== '0.00' ? 'pointer' : '' }}>{`${i}h`}</td>} centered={true}>
                    <p style={{ fontweight: 'bold',margin: '10px',fontSize: 'large'}}>Worklogs</p>
                    <Modal.Content>
                      {
                        <>
                          <p style={{ display: 'inline', margin: '0px 600px 0px 0px' }}>comment</p>
                          <p style={{ display: 'inline' }}>Time spent</p>
                          <hr />
                          {props.comments.map((comment, cindex) => cindex === index ? <p style={{ display: 'inline-block' }}>{`-${comment}  `}</p> : null)}

                          <p style={{ color: 'gray', display: 'inline', float: 'right', margin: '0px 160px 0px 0px' }} >{`${i}h`}</p>
                          <img style={{ width: '35px', float: 'right', margin: '-5px -95px 0px 0px' }} src={props.avatarurls} alt='avatarImage' />

                          {props.comments.map((comment, cindex) => cindex === index ? <p style={{ float: 'right', margin: '25px -40px 0px 0px' }}>{`${moment(props.datearray[cindex]).format('MMM Do YYYY')}`}</p> : null)}

                          <hr />

                          <Button style={{ float: 'right' }} color='blue' onClick={handleClose} >close</Button>


                        </>}
                    </Modal.Content>
                  </Modal>
                </> : <td style={{ color: 'grey' }} >{`${i}h`}</td>
              }
            </>
          )
        }


      </tr>


    </>
  );


}

export default User;

