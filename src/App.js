import React from 'react'


import VideoPlayer from "./components/VideoPlayer"
import Options from "./components/Options"
import Notification from "./components/Notifications"


const App = () => {
  return (
    <div className='home'>
        <h2>
                Video Chat 
        </h2>
    <VideoPlayer />
    <Options>
        <Notification />
    </Options>
    </div>
     )
}

export default App;
