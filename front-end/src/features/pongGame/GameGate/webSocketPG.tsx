import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"
import { useNavigate } from 'react-router-dom';

export const WebSocketPG = () => {

    const navigate = useNavigate();
    const socket = useContext(WebsocketContext);

    const handleRedirectToQueueGate = () => {
        socket.emit('goQueueList', socket.id);
        navigate('../queue');
    }

    const handleQuitQueueGate = () => {
        socket.emit('goQuitQueueGate', socket.id);
        navigate('../../home');
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
                <button className="buttonGame" onClick={handleRedirectToQueueGate}>
                    <span>Play</span></button>
                <button className="buttonGame" onClick={handleQuitQueueGate}>
                    <span>Quit </span></button>
            </div>
        </div>
    )
}

export default WebSocketPG;