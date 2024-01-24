import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../../contexts/WebsocketContext"


export const WebSocketPG = () => {

    const [value, setValue] = useState('');
    const socket = useContext(WebsocketContext);

    useEffect(() => {

        const handleConnect = () => {
                console.log('Connected !');
        }

        const handleMessage = (data: any) => {
                console.log('onMessage event received !');
                console.log(data);
        }

        const handleKeyDown = (event: any) => {
            if (event.key === 'ArrowLeft') {
                console.log('ARROW LEFT');
                socket.emit('keydown', { direction: 'left'});
            }
            else if (event.key === 'ArrowRight') {
                console.log('ARROW RIGHT');
                socket.emit('keydown', { direction: 'right'});
            }
        }

        socket.on('connect', handleConnect);
        socket.on('onMessage', handleMessage);
    
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            console.log("Unregistering events...");  
            socket.off('connect');
            socket.off('onMessage');//not closing
            window.removeEventListener('keydown', handleKeyDown);
        }

    }, [socket]);

    const onSubmit = () => {
        socket.emit('newMessage', value);
        setValue('');
    }

    return (
        <div>
            <div>
                <h1>Websocket Component</h1>
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)}
                />
                <button onClick={onSubmit}>Submit</button>
            </div>
        </div>
    )
}