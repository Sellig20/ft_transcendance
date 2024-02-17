import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"
import { useNavigate } from "react-router-dom";

const WebsocketQG = () => {

    const socket = useContext(WebsocketContext);
    const navigate = useNavigate();

    useEffect(() => {
    
        const handlePrepareMatch = () => {
            navigate("/game/startGame")
        }

        socket.on('prepareForMatch', handlePrepareMatch);

        return () => {
            socket.off('prepareForMatch', handlePrepareMatch);
        };

    }, [socket]);
    return (
        <div>
            <h2>Page queue list</h2>
        </div>
    )

}

export default WebsocketQG;