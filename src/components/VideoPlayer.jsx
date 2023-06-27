import React , {useContext} from 'react'
import classes from './styles/video.module.css'
import { SocketContext } from '../SocketContext'

const VideoPlayer = () => {
  const {call , 
    callAccepted,
    callEnded,
    myVideo,
    userVideo,
    stream,
    name,
    } = useContext(SocketContext);
  return (
    <div className={classes.container}>
        {/** my video */}
        {stream && (
        <div className={classes.video__container}>
          <h1>{name || 'Name'}</h1>
        <video  playsInline muted ref={myVideo} autoPlay  width={350}/>
        </div>
        )}
      {/** other's person  video */}

      {
        callAccepted && !callEnded && (
        <div className={classes.video__container}>
        <h1>{call.name || 'Name'}</h1>
        <video  playsInline  ref={userVideo} autoPlay className={classes.video} />
        </div>
        )
      }

    </div>
  )
}

export default VideoPlayer