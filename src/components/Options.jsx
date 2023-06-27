import React , {useContext,useState} from 'react'
import classes from './styles/options.module.css'
import { SocketContext } from '../SocketContext'
import { CopyToClipboard } from 'react-copy-to-clipboard';



const Options = ({children}) => {

  const {call, 
    callAccepted,
    setmyName,
    callEnded,
    myId,
    myVideo,
    userVideo,
    stream,
    name,
    callUser , leaveCall , answerCall} = useContext(SocketContext);
  
    const [idToCall,setIdToCall] = useState('')
    
  return (
    <div className={classes.big__container}>
    <div className={classes.container}>
        <div className={classes.infos__container}>
        <h2>Account Info :</h2>
        <input type="text" placeholder='Name' onChange={(e)=>setmyName(e.target.value)} />
        <CopyToClipboard text={myId}>
        <button>COPY YOUR ID</button>
        </CopyToClipboard>
        

        </div>
        <div  className={classes.infos__container}>
        <h2>Make A Call</h2>
        <input type="text" placeholder='Id To Call' value={idToCall} onChange={(e)=>setIdToCall(e.target.value)} />
        {callAccepted && !callEnded ?(
              <button onClick={leaveCall}>Hang UP</button>
        ):(
          <button onClick={()=>callUser(idToCall)}>Call</button>
        )}
        </div>
       
    </div>
     {children}
     </div>
  )
}

export default Options