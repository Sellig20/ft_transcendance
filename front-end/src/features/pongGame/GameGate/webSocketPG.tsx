import { useContext, useEffect, useState, useRef } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Rootstate } from '../../../app/store';
import { createContext} from "react";
import { io, Socket } from 'socket.io-client';

export const WebSocketPG = (
    socket: any
) => {

    const userid = useSelector((state: Rootstate) => state.user.id);
    // const count = useRef(0)
    const navigate = useNavigate();
    // const socket = useContext(WebsocketContext);
    // const [socket, setSocket] = useState<Socket | null>(null)

    // const first = (
	// 	newSocket: Socket
	// ) => {
	// 	// callApi(userid, newSocket, true);
	// 	setSocket(newSocket)
	// }

    // useEffect(() => {
	// 	if (count.current === 0)
	// 	{
    //         count.current++;
	// 		const newSocket = io(`http://${process.env.HOST_IP}:8002`)
	// 		first(newSocket)
	// 	}
	// }, [first])

    const handleRedirectToQueueGate = () => {
        socket?.emit('goQueueList', socket?.id);
        navigate('../queue');
    }

    const handleQuitQueueGate = () => {
        socket?.emit('goQuitQueueGate', socket?.id);
        navigate('../../home');
    }

    // const firstListener = (
	// 	messageprop: any
	// ) => {
	// 	console.log("envoie des donnee users au server socket...", userid)
	// 	socket?.emit("FIRST", {userid:userid})
	// };

	// useEffect(() => {
    //     // console.log("dfgdfgdfgdfg", socket.id)
	// 	socket?.on("FIRST", firstListener)
	// 	return () => {
	// 		socket?.off("FIRST", firstListener)
    //     }
    // })
    
    // useEffect(() => {

    //     if (socket?.connected)
    //     {
    //         console.log(`je suis ${socket?.id} dans game gate .tsx`);
    //     }

    //     return () => {
    //         console.log("Unregistering events...");  
    //         socket?.off('connect');
    //         socket?.off('goQueueList', handleRedirectToQueueGate);
    //     }

    // }, []);

    return (
        <div>
            <div>
                <button className="buttonGame" onClick={handleRedirectToQueueGate}>
                    <span>Play</span></button>
                <button className="buttonGame" onClick={handleQuitQueueGate}>
                    <span>Quit </span></button>
            </div>
        </div>
    )
}

export default WebSocketPG;