import { useNavigate } from 'react-router-dom';

export const WebSocketPG = ({ socket }) => {
    
    const navigate = useNavigate();
    const handleRedirectToQueueGate = (mapChoice: number) => {
        console.log("MAP CHOICE => ", mapChoice, " de ", socket.id);
        socket?.emit('goQueueList', { socketId: socket.id, mapChoice });
        navigate('../queue');
    }

    const handleSelectGame = () => {
        navigate('../../home');
    }

    return (
        <div>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
            />
            <div className="PG mt-4">
                <div className="jumbotron mt-4">
                <h1>PONG GAME</h1>
                <p>You have to select a map and do queue</p>
                </div>
        
                <div className="row">
                <div className="col-12">
                    <button className="buttonGame" onClick={() => handleRedirectToQueueGate(1)}>
                        <span>Queue for map 1</span></button>
                </div>
        
                <div className="col-12 mt-2">
                    <button className="buttonGame" onClick={() => handleRedirectToQueueGate(2)}>
                        <span>Queue for map 2</span></button>
                </div>
        
                <div className="col-12 mt-2">
                    <button className="buttonGame" onClick={handleSelectGame}>
                        <span>Quit game home</span></button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default WebSocketPG;