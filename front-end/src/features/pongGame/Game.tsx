import { WebSocketPG } from './webSocketPG';
import { WebsocketSG } from './websocketSG';
import { useEffect, useState, useRef } from "react"
import { io, Socket } from 'socket.io-client';
import { Rootstate } from '../../app/store';
import { useSelector } from 'react-redux';
import './style.css'
import WebsocketQG from './websocketQG';

export default function Game() {
    const [socket, setSocket] = useState<Socket | null>(null)
    const count = useRef(0)
    const userid = useSelector((state: Rootstate) => state.user.id);

    const first = (
		newSocket: Socket
	) => {
		setSocket(newSocket)
	}

    useEffect(() => {
		if (count.current === 0)
		{
			const newSocket = io(`http://${process.env.HOST_IP}:8002`)
			setSocket(newSocket);
		}
		count.current++;
	}, [first])

    const firstListener = (
		messageprop: any
	) => {
		console.log("envoie des donnee users au server socket...", userid)
		socket?.emit("FIRST", {userid:userid})
	};

	useEffect(() => {
		socket?.on("FIRST", firstListener)
		return () => {
			socket?.off("FIRST", firstListener)
        }
    })

    return (
        <div>
            <div id='GameHome' className='GH'>
                <WebSocketPG socket={socket} updateSocket={setSocket}/>
            </div>
          
        </div>
    )
}