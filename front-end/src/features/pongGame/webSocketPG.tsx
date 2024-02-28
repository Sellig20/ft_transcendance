import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Rootstate } from '../../app/store';
import WebsocketQG from './websocketQG';
import { Socket } from 'socket.io-client';
import { useEffect } from 'react';

// export const WebSocketPG = ( updateSocket: any ) => {
interface WebSocketPGProps {
    socket: Socket | null;
    updateSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

export const WebSocketPG: React.FC<WebSocketPGProps> = ({ socket, updateSocket }) => {
    

    const userid = useSelector((state: Rootstate) => state.user.id);
    const navigate = useNavigate();
   
        const handleRedirectToQueueGate = () => {
            socket?.emit('goQueueList', userid);
            navigate('./queue');
        }
    
        const handleQuitQueueGate = () => {
            // socket?.emit('goQuitQueueGate', userid);
            navigate('../../home');
        }

    return (
        <div>
            <div>

                <h1>Welcome in the pong game !</h1>
                <p>Do you wanna play ? You have to click here and wait for someone to play with !</p>
                <button className="buttonGame" onClick={handleRedirectToQueueGate}>
                    <span>Play</span></button>
                <button className="buttonGame" onClick={handleQuitQueueGate}>
                    <span>Quit</span></button>
            </div>
        </div>
    )
}

export default WebSocketPG;