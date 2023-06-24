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
                setStream(currentStream);

                myVideo.current.srcObject = currentStream;
        });

        socket.on("me",(id)=>setMyId(id))

        socket.on("calluser" , ({from , name : callerName , signal})=>{
            setCall({isreceivingCall : true,from,callerName,signal})
        })
    },  [])
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


            connectionRef.current = peer;
        }

        const leaveCall = () =>{
                setcallEnded(true);

               connectionRef.current.destroy() ;

               window.location.reload() // to get another id and clear all data
        }

        return (
            <SocketContext.Provider value={{
                call , 
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