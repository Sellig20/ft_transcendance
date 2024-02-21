import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"
import { useNavigate } from "react-router-dom";

const WebsocketQG = () => {

    const socket = useContext(WebsocketContext);
    const navigate = useNavigate();

    const handleQuitQueue = () => {
        socket.emit('goQuitQueue');
        navigate('../');
    }

    useEffect(() => {
    
        const handlePrepareMatch = () => {
            console.log("prepare match in queue gate");
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
            <h3>Loading... finding someone to play with you</h3>
            <button onClick={handleQuitQueue}>Quit Queue List</button>
        </div>
    )

}

export default WebsocketQG;