import React , {useContext , useEffect } from 'react'

import { SocketContext } from '../SocketContext'
import classes from './styles/notification.module.css'


const Notifications = () => {
   
  const {call , callAccepted , answerCall} = useContext(SocketContext)

  useEffect(() => {
      
     
  }, [call]);
  console.log('IN NOTIF ' , call.isreceivingCall)
  return <>
  <div className={classes.container}>
        {call.isreceivingCall && !callAccepted && (
            <div>
              <h1>{call.name} is Calling !</h1>
             { console.log(call.name)}
              <button onClick={answerCall}>Answer</button>
            </div>

        )}
        {!call.isreceivingCall && <h1>ANSWER</h1>}
  </div>
</>     
  
}

export default Notifications