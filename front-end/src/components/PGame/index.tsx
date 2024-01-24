import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { socket } from '../../contexts/WebsocketContext';

    const PGame = () => {
        const [message, setMessage] = useState('');
        const [newSocket, setSocket] = useState<Socket | null>(null)
    
        const sendMessage = () => {
            if (newSocket) {
                newSocket.emit('message', 'Hello from client!');
            }
            else
            {
                console.log("pas de web sockets ma beeeelleeee");
            }
        };

        const handleInputChange = (event: any) => {
            setMessage(event.target.value);
        };
    
        return (
            <nav>
                <input type="text" id="messageInput" value={message} onChange={handleInputChange} />
                <div>Je suis le composant et japparais</div>
                <button onClick={sendMessage}>Envoyer le message</button>
            </nav>
        )
}

export default PGame