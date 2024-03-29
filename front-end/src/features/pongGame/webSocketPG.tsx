import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Rootstate } from '../../app/store';
import { useEffect } from 'react';

export const WebSocketPG = ({ socket, userId, page, setPage }) => {
    const navigate = useNavigate();
    const handleRedirectToQueueGate = (mapChoice: number) => {
        // console.log("MAP CHOICE => ", mapChoice, " de ", socket.id);
        socket?.emit('goQueueList', { socketId: socket.id, mapChoice, userId});
        navigate('../queue');
    }
    
    useEffect(() => {
        if (page === "lobby") {
            navigate('../');
        }
        setPage("PG");
    })

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
                <div className='myGameText'>
                    <p>
                        The goal of Pong is to score points by making the ball pass the opponent's paddle.
                        The player with 11 points at the end of the game wins.
                    </p>
                    <p>
                        Players take turns hitting the ball with their paddles, trying to make it go past the opponent's paddle.
                        Use the arrow keys to control the position of your paddle and intercept the ball.
                        If the ball passes your opponent's paddle, you score a point. The ball resets to the center, and a new round begins.
                        The game continues until a player scores 11, which is the maximum point you can get.
                    </p>
                    <p>
                        Use the up arrow key to move your paddle up.
                    </p>
                    <p>
                        Use the down arrow key to move your paddle down.
                    </p>
                    <p>
                        You can select a basic map (button MAP 1), or a rainbow map (button MAP 2), where the ball's velocity is incremented when both players get 4 points, and then 8 points.
                    </p>
                    <p> Have fun !</p>
                </div>
                    <div className='myGameSelection'>
                        <p>You have to select a map and do queue</p>
                        <br></br>
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
            </div>
        </div>
    );
};

export default WebSocketPG;