import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"
import { useNavigate } from 'react-router-dom';

export const WebSocketPG = () => {

    const navigate = useNavigate();
    const socket = useContext(WebsocketContext);

    const handleRedirectToQueueGate = () => {
        socket.emit('goQueueList', socket.id);
        console.log("Nous avons clique !");
        navigate('../queue');
    }
    
    useEffect(() => {

        if (socket.connected)
        {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
        }

        return () => {
            console.log("Unregistering events...");  
            socket.off('connect');
            socket.off('goQueueList', handleRedirectToQueueGate);
        }

    }, []);

    return (
        <div>
            <div>
                <h1>Websocket Component</h1>
                <button onClick={handleRedirectToQueueGate}>QueueGateuh</button>
            </div>
        </div>
    )
}

export default WebSocketPG;