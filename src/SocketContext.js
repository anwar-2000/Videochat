import React , {createContext , useRef , useState , useEffect} from "react"

import { io } from "socket.io-client"

import Peer from "simple-peer"

const SocketContext = createContext();

const socket = io("http://localhost:5000")

const ContextProvider = ({children}) =>{
    const [stream , setStream] = useState(null)

    const [name , setmyName] = useState("")
    const [myId , setMyId] = useState("")
    const [call,setCall] = useState({})
    const [callAccepted , setcallAccepted] = useState(false)
    const [callEnded , setcallEnded] = useState(false)

    const myVideo = useRef()
    const userVideo = useRef()

    const connectionRef = useRef()

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video : true , audio : true}).then((currentStream)=>{
               
                //console.log(currentStream);
                setStream(currentStream);
                //console.log(stream)
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                  }
        });

        socket.on("me",(id)=>setMyId(id))

        socket.on("calluser" , ({from , name : callerName , signal})=>{
            console.log(signal , from)
            setCall({isreceivingCall : true,from,callerName,signal})
           
        })
    },  [])

    useEffect(() => {
       //console.log(stream);
      }, [stream , call]);

      useEffect(() => {
        console.log('CONTEXT',call);
       }, [ call]);
      
      useEffect(() => {
        if (myVideo.current && stream) {
          myVideo.current.srcObject = stream;
          myVideo.current.play();
        }

        
      }, [stream]);


        const answerCall = () =>{
                setcallAccepted(true);

                const peer = new Peer({initiator : false,trickle:false,stream});

                peer.on('signal'  , (data)=>{
                    socket.emit("answercall" , ({signal : data , to : call.from}))
                });

                peer.on("stream" , (currentStream)=>{
                    userVideo.current.srcObject = currentStream;
                });

                peer.signal(call.signal)

                connectionRef.current = peer;
        }

        const callUser = (id) =>{
            const peer = new Peer({initiator : false,trickle:false,stream});

            peer.on("signal" , (data)=>{
                socket.emit("calluser",({userToCall : id , signalData : data , from : myId , name}))
            })

            peer.on("stream" , (currentStream)=>{
                userVideo.current.srcObject = currentStream;
            });

            socket.on("callaccepted" ,(signal)=>{
                setcallAccepted(true);
                peer.signal(signal)
            });

           // console.log(peer)
            connectionRef.current = peer;
           // console.log(connectionRef)
        }

        const leaveCall = () =>{
                setcallEnded(true);

               connectionRef.current.destroy() ;

               window.location.reload() // to get another id and clear all data
        }

        return (
            <SocketContext.Provider value={{
                call , 
                setmyName,
                callAccepted,
                callEnded,
                myId,
                myVideo,
                userVideo,
                stream,
                name,
                callUser , leaveCall , answerCall
            }}>
                    {children}
            </SocketContext.Provider>
        )
}

export {ContextProvider , SocketContext}