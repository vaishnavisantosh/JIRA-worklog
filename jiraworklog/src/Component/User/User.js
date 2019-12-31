import React, { useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import moment from "moment";
import "./User.css";

const User = (props) => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { avatarurls, name, horizontalTotal, time, comments, datearray } = props
  return (
    <>
      <tr>
        <td><img src={avatarurls} alt='avatarImage' /></td>
        <td className='userName'>{name}</td>
        <td className='worklogTime'> {`${horizontalTotal}h`} </td>
        {
          time.map((i, index) =>
            <>
              {i !== "0.00" ?
                <>
                  <Modal onOpen={handleShow} open={show} centered={true} style={{ width: '70%', height: '50%' }} trigger={
                    <td style={{ color: i !== '0.00' ? 'blue' : 'grey', cursor: i !== '0.00' ? 'pointer' : '' }}>{`${i}h`}</td>}>
                    <p className='worklogTitle'>Worklogs</p>
                    <Modal.Content style={{ marginTop: '-30px' }}>
                      {
                        <>
                          <p className='title'>Comment</p>
                          <p className='title' style={{ display: 'inline' }}>Time spent</p>
                          <hr />
                          {comments.map((comment, cindex) => cindex === index ? <p style={{ display: 'inline-block', fontWeight: 'normal', fontSize: '20px' }}>{`-${comment}`}</p> : null)}
                          <p className='modalWorklogTime'>{`${i}h`}</p>
                          <img style={{ float: 'right', margin: '-5px -95px 0px 0px' }} src={avatarurls} alt='avatarImage' />
                          {comments.map((comment, cindex) => cindex === index ? <p className='comments'>{`${moment(datearray[cindex]).format('MMM Do YYYY')}`}</p> : null)}
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

