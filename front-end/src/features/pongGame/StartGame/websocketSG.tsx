import { useContext, useEffect, useState, useRef } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"
import { GameStateFD } from "./GameStateFD";
import { useNavigate } from "react-router-dom";

export const WebsocketSG = () => {

    const socket = useContext(WebsocketContext);
    const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [gameState, setGameState2] = useState<GameStateFD>(new GameStateFD());
    const navigate = useNavigate();

    const setWinner = (data: {winnerIs: string}) => {
        if (data.winnerIs === "one") {
            gameState.player1Winner = true;
        }
        else if (data.winnerIs === "two") {
            gameState.player2Winner = true;
        }
    }

    const updateScorePlayer1 = (data: {scoreP1: number}) => {
        gameState.player1Score = data.scoreP1;
    }

    const updateScorePlayer2 = (data: {scoreP2: number}) => {
        gameState.player2Score = data.scoreP2;
    }

    const displayScore = (context: CanvasRenderingContext2D) => {
        context.font = "45px sans-serif";
        context.fillText(gameState.player1Score.toString(), gameState.boardWidth / 5, 45);
        context.fillText(gameState.player2Score.toString(), gameState.boardWidth * 4 / 5 - 45, 45);
    }
    
    const displayLine = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
    for (let i = 10; i < board.height; i += 25) {
            context.fillRect(board.width / 2 - 10, i, 5, 5);
        }
    }

    const displayEndGame = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        context.fillStyle = 'white';
        context.font = '40 px Arial';
        context.textAlign = 'center';
        context.fillText('END GAME', board.width / 2, board.height / 2);
    }

    const createBoardGame = () => {
        const board = document.getElementById("board") as HTMLCanvasElement | null;
        const boardHeight = 500;
        const boardWidth = 500;
        if (board) {
            board.height = boardHeight;
            board.width = boardWidth;
            return board;
        }
    }
    
    const createContextCanvas = (board: HTMLCanvasElement) => {
        const context = board.getContext('2d');
        if (context) {
            canvasContextRef.current = context
            return context;
        }
        return null;
    }
    
    const drawBall = (context: CanvasRenderingContext2D) => {
        context.fillStyle = "pink";
        context.beginPath();
        context.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball.width, gameState.ball.height);
        context.fill();
    }

    const ballAgainstPaddle = (data: {velX: number}) => {
        gameState.ball.velocityX = data.velX;
    }//collisionBall detecting aingsnt machin evenement

    const ballAgainstBorder = (data: {velY: number}) => {
        gameState.ball.velocityY = data.velY;
    }//borderCollision detecting borderevenemt

   

    const drawPaddle1 = (context: CanvasRenderingContext2D) => {
        context.beginPath();
        context.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.paddle1.width, gameState.paddle1.height);
        context.fill();
    }

    const drawPaddle2 = (context: CanvasRenderingContext2D) => {
        context.beginPath();
        context.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.paddle2.width, gameState.paddle2.height);
        context.fill();
    }

    const initiateBall = (data: {x: number, y: number}) => {
        if (data)
        {
            gameState.ball.x = data.x;
            gameState.ball.y = data.y;
        }
    } 

    const initiatePaddle1 = (data: {y: number}) => {
        console.log("y paddle 1 = ", data.y);
        gameState.paddle1.y = data.y;
    }

    const initiatePaddle2 = (data: {y: number}) => {
        console.log("y paddle 2 = ", data.y);
        gameState.paddle2.y = data.y;
    }

    const update = () => {
        
        const board = createBoardGame();
        if (board) {
                const context = createContextCanvas(board);
                if (context) {
                    if (gameState.player1Winner === true || gameState.player2Winner === true) {
                        console.log("FIN DU JEU");
                        displayEndGame(context, board);
                        return;
                    }
                    context.fillStyle = "skyblue";
                    drawPaddle1(context);
                    drawPaddle2(context);
                    drawBall(context);
                    displayScore(context);
                    displayLine(context, board);
                }
            }
            
            // requestAnimationFrame(update);
        };

        const handleAbandon = () => {
            socket.emit('Abandon', socket.id);
            navigate('../');
        }
    
        useEffect(() => {
        ////////////// LOOP FOR FRONTEND /////////////////////////
            const idInterval = setInterval(() => {
                update();
        }, 1000 / 30); // 16 ms (environ 60 FPS)
                
        ////////////// AU LANCEMENT DE START GAME //////////////
        const handleConnect = () => {
            console.log('Connected in START GAME!');
        }
        
        if (socket.connected) {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
        }
        
        const handleKeyDown = (event: KeyboardEvent) => {
            socket.emit('keydown', {key: event.code})
        }; 
        
        socket.on('connect', handleConnect);
        window.addEventListener('keydown', handleKeyDown);

        ///////////////////// SERVEUR RENVOIE ////////////////////////////
        socket.on('initplayer1', (data: {y: number}) => {
            initiatePaddle1(data);
        })

        socket.on('initplayer2', (data: {y: number}) => {
            initiatePaddle2(data);
        })

        socket.on('ballIsMoving', (data: {x: number, y: number}) => {
            initiateBall(data);
        })

        socket.on('updateScoreP1', (data: {scoreP1: number}) => {
            updateScorePlayer1(data);
        })

        socket.on('updateScoreP2', (data: {scoreP2: number}) => {
            updateScorePlayer2(data);
        })

        socket.on('detectCollisionW/Paddle', (data : {velX: number}) => {
            ballAgainstPaddle(data);
        })//detecting Ball agaist paddles

        socket.on('detectBorder', (data: {velY: number}) => {
            ballAgainstBorder(data);
        })//detecting Ball against border wall

        socket.on('winnerIs', (data: {winnerIs: string}) => {
            setWinner(data);
        })

        return () => {
            console.log("Unregistering events...");  
            socket.off('connect');
            window.removeEventListener('keydown', handleKeyDown);
            socket.off('updatePaddle1');
            socket.off('updatePaddle2');
            socket.off('updateCanvasAfterSend');
            socket.off('updateBallDataToClientTHREE');
            socket.off('initplayer1');
            socket.off('initplayer2');
            socket.off('updatePlayer2');
            socket.off('updatePlayer2');
            clearInterval(idInterval);
        }
        
    }, [update]);
    
    return (
        <div className="game-container">
            <canvas id="board"></canvas>
            <button onClick={handleAbandon}>Abandon Game</button>
        </div>
  );
}

export default WebsocketSG;