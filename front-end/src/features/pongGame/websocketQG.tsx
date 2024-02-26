import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Rootstate } from "../../app/store";
import { useSelector } from "react-redux";

const WebsocketQG = (socket: any) => {

    const userid = useSelector((state: Rootstate) => state.user.id);
    const navigate = useNavigate();
    const handleQuitQueue = () => {
        socket?.emit('goQuitQueue');
        navigate('../');
    }

    useEffect(() => {
    
        const handlePrepareMatch = () => {
            console.log("prepare match in queue gate");
            navigate("/game/startGame")
        }

        // socket?.on('prepareForMatch', handlePrepareMatch);

        return () => {
            socket?.off('prepareForMatch', handlePrepareMatch);
        };

    }, [socket]);
    return (
        <div>
             <h2>Page queue list</h2>
             <h3>Loading... finding someone to play with you</h3>
             <button className="buttonGame" onClick={handleQuitQueue}>
                 <span>Quit Queue List</span></button>
         </div>
    )

}

export default WebsocketQG;