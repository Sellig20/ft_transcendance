import { useEffect, useState, useRef } from "react"
import { io, Socket } from 'socket.io-client';
import { Rootstate } from '../../app/store';
import { useSelector } from 'react-redux';
import './style.css'
import WebSocketPG from './webSocketPG';
import WebSocketSG from './webSocketSG';
import WebSocketQG from './webSocketQG';
import { Route, Routes, useParams } from "react-router-dom";
import PrivateQueue from "./PrivateQueue";

export default function Game() {

	
    const [socket, setSocket] = useState<Socket | null>(null)
    const count = useRef(0)
    const userid = useSelector((state: Rootstate) => state.user.id);




    const first = (newSocket: Socket) => {
		setSocket(newSocket)
	}

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
	}, [firstListener])

    useEffect(() => {

		if (count.current === 0)
		{
			const newSocket = io(`http://${process.env.HOST_IP}:8002`)
			first(newSocket);
		}
		count.current++;

		
	}, [])



	return (
	    <Routes>
			<Route path="/" element={
				<div>
				
					<WebSocketPG socket={socket} userId={userid}/>
				</div>
			}/>
			<Route path="/queue" element={
				<div>
					<WebSocketQG socket={socket}/>
				</div>
			}/>
			<Route path="/queuePrivate/:idP" element={
				<div>
					<PrivateQueue />
				</div>
			}/>
			<Route path="/startgame" element={
				<div>
					<WebSocketSG socket={socket}/>
				</div>
			}/>
        </Routes>
    );
}











// return (
//     // <div>
//     //     <Routes>
//     //         <Route path="/" element={<WebSocketPG socket={socket} updateSocket={setSocket}/>} />
//     //         <Route path="/queue" element={<WebSocketQG socket={socket} updateSocket={setSocket}/>} />
//     //         <Route path="/startgame" element={<WebSocketSG socket={socket} updateSocket={setSocket}/>} />
//     //     </Routes>
//     // </div>
// )