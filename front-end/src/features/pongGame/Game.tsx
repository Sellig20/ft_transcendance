import GameGate from './GameGate/index'
import StartGame from './StartGame/index'
import { socket, WebsocketProvider } from './contexts/WebsocketContext';
import { WebSocketPG } from './GameGate/webSocketPG';
import { WebsocketSG } from './StartGame/websocketSG';
import QueueGate from './QueueGate/index'
import { Routes, Route } from 'react-router-dom';
import Error from './Error/index'
import './style.css'

export function Game() {
	
    return (
        <Routes>
                <Route path="/" element={
                    <WebsocketProvider value ={socket}>
                        <div>
                            <GameGate />
                            <WebSocketPG />
                        </div>
                    </WebsocketProvider>
                }/>
                <Route path="/queue" element={
                    <WebsocketProvider value ={socket}>
                        <div>
                            <QueueGate />
                        </div>
                    </WebsocketProvider>
                }/>
                <Route path="/startGame" element={
                    <WebsocketProvider value ={socket}>
                        <div>
                            <StartGame />
                            <WebsocketSG />
                        </div>
                    </WebsocketProvider>
                }/>
                <Route path="*" element={<Error />} />
        </Routes>
    )
}

export default Game;