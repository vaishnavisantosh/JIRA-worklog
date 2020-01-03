import React, { useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import moment from "moment";
import "./User.css";

const User = (props) => {
  const [show, setShow] = useState(false);
  const { avatarurls, name, horizontalTotal, time, comments, selectedDateRange } = props
  return (
    <>
      <tr style={{borderBottom:' 1px solid rgba(211,211,211, 0.8)'}}>
        <td className='hard_left' style={{height:'69px'}}><img src={avatarurls} alt='avatarImage' style={{marginTop:'-7px'}} /></td>
        <td className='userName next_left' style={{height:'69px',marginLeft:'-25px'}}>{name}</td>
        <td className='worklogTime next_right' style={{height:'69px',marginLeft:'15px'}}> {`${horizontalTotal}h`} </td>
        {
          time.length ?
            time.map((i, index) =>
              <>
                {i !== "0.00" ?
                  <>
                    <Modal onOpen={()=>setShow(true)} open={show} centered={true} style={{ width: '70%', height: '50%' }} trigger={
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
                            {comments.map((comment, cindex) => cindex === index ? <p className='comments'>{`${moment(selectedDateRange[cindex]).format('MMM Do YYYY')}`}</p> : null)}
                            <hr />
                            <Button style={{ float: 'right' }} color='blue' onClick={()=>setShow(false)} >close</Button>
                          </>}
                      </Modal.Content>
                    </Modal>
                  </> : <td style={{ color: 'grey' }} >{`${i}h`}</td>
                }
              </>) : 'no records Found'
        }
      </tr>
    </>
  );
}

export default User;

