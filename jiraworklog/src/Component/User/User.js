import React, { useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import moment from "moment";
import "./User.css";

const User = (props) => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <tr>
        <td><img src={props.avatarurls} alt='avatarImage' /></td>
        <td className='userName'>{props.name}</td>
        <td className='worklogTime'> {`${props.horizontalTotal}h`} </td>
        {
          props.time.map((i, index) =>
            <>
              {i !== "0.00" ?
                <>
                  <Modal onOpen={handleShow} open={show} centered={true} style={{ width: '70%', height: '50%', margin: '10% 0% 0% 15%' }} trigger={
                    <td style={{ color: i !== '0.00' ? 'blue' : 'grey', cursor: i !== '0.00' ? 'pointer' : '' }}>{`${i}h`}</td>}>
                    <p className='worklogTitle'>Worklogs</p>
                    <Modal.Content style={{ marginTop: '-30px' }}>
                      {
                        <>
                          <p className='title'>Comment</p>
                          <p className='title' style={{ display: 'inline' }}>Time spent</p>
                          <hr />
                          {props.comments.map((comment, cindex) => cindex === index ? <p style={{ display: 'inline-block', fontWeight: 'normal', fontSize: '20px' }}>{`-${comment}`}</p> : null)}
                          <p className='modalWorklogTime'>{`${i}h`}</p>
                          <img style={{ float: 'right', margin: '-5px -95px 0px 0px' }} src={props.avatarurls} alt='avatarImage' />
                          {props.comments.map((comment, cindex) => cindex === index ? <p className='comments'>{`${moment(props.datearray[cindex]).format('MMM Do YYYY')}`}</p> : null)}
                          <hr />
                          <Button style={{ float: 'right' }} color='blue' onClick={handleClose} >close</Button>
                        </>}
                    </Modal.Content>
                  </Modal>
                </> : <td style={{ color: 'grey' }} >{`${i}h`}</td>
              }
            </>)
        }
      </tr>
    </>
  );
}

export default User;

