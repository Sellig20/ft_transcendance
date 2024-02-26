import GameGate from './GameGate/index'
import StartGame from './StartGame/index'
import { socket, WebsocketProvider } from './contexts/WebsocketContext';
import { WebSocketPG } from './GameGate/webSocketPG';
import { WebsocketSG } from './StartGame/websocketSG';
import QueueGate from './QueueGate/index'
import { Routes, Route } from 'react-router-dom';
import Error from './Error/index'
import { useContext, useEffect, useState, useRef } from "react"
import { io, Socket } from 'socket.io-client';
import { Rootstate } from '../../app/store';
import { useSelector } from 'react-redux';
import './style.css'

export default function Game() {
    const [socket, setSocket] = useState<Socket | null>(null)
    const count = useRef(0)
    const userid = useSelector((state: Rootstate) => state.user.id);

    const first = (
		newSocket: Socket
	) => {
		// callApi(userid, newSocket, true);
		setSocket(newSocket)
	}

    useEffect(() => {
		if (count.current === 0)
		{
			const newSocket = io(`http://${process.env.HOST_IP}:8002`)
			setSocket(newSocket);
		}
		console.log("fdgfddh")
		count.current++;
	}, [first])

    const firstListener = (
		messageprop: any
	) => {
		console.log("envoie des donnee users au server socket...", userid)
		socket?.emit("FIRST", {userid:userid})
	};

	useEffect(() => {
        // console.log("dfgdfgdfgdfg", socket.id)
		socket?.on("FIRST", firstListener)
		return () => {
			socket?.off("FIRST", firstListener)
        }
    })

    return (
        // <Routes>
        //         <Route path="/" element={
        //             <WebsocketProvider value ={socket}>
        //                 <div>
        //                     <GameGate />
        //                     <WebSocketPG />
        //                 </div>
        //             </WebsocketProvider>
        //         }/>
        //         <Route path="/queue" element={
        //             <WebsocketProvider value ={socket}>
        //                 <div>
        //                     <QueueGate />
        //                 </div>
        //             </WebsocketProvider>
        //         }/>
        //         <Route path="/startGame" element={
        //             <WebsocketProvider value ={socket}>
        //                 <div>
        //                     <StartGame />
        //                     <WebsocketSG />
        //                 </div>
        //             </WebsocketProvider>
        //         }/>
        //         <Route path="*" element={<Error />} />
        // </Routes>
		// <div>
		// 	caca
		// </div>
        <WebSocketPG socket={socket}/>
    )
}