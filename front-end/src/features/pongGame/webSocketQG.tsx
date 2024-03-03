import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";

export const WebSocketQG = ({ socket}) => {

    const navigate = useNavigate();
    const handleQuitQueue = () => {
        socket?.emit('quitQueue', socket.id);
        navigate('../');
    }

    useEffect(() => {
        const handlePrepareMatch = () => {
            console.log("prepare match in queue gate");
            navigate("/game/startGame")
        }
      
            socket?.on('prepareForMatch', handlePrepareMatch);
    return () => {
            console.log("Unregistering events in Queue gate");
            // socket?.emit('refreshInQueue' );
            socket?.off('prepareForMatch', handlePrepareMatch);
        };

    }, [socket]);
    return (
        <div>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
            />
            <div className="QG mt-4">
                <div className="jumbotron mt-4">
                    <h1>QUEUE</h1>
                    <div className="loading-dots">
                        <div><p>Loading</p></div>
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                    </div>
                    <p> finding someone to play with you</p>

                    <div className="row">
                        <div className="col-12">
                            <button className="buttonGame" onClick={handleQuitQueue}>
                                <span>Quit Queue List</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WebSocketQG;