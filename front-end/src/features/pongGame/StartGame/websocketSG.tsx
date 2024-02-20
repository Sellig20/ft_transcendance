import { useContext, useEffect, useState, useRef } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"
import { GameStateFD } from "./GameStateFD";

export const WebsocketSG = () => {

    const socket = useContext(WebsocketContext);
    const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [gameState, setGameState2] = useState<GameStateFD>(new GameStateFD());

    const setWinner = (winnerIdentity: string) => {
        if (winnerIdentity === "one") {
            gameState.player1Winner = true;
        }
        else if (winnerIdentity === "two") {
            gameState.player2Winner = true;
        }
    }

    const updateScorePlayer1 = (scoreP1: number) => {
        gameState.player1Score = scoreP1;
    }

    const updateScorePlayer2 = (scoreP2: number) => {
        gameState.player2Score = scoreP2;
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

    const ballAgainstPaddle = (velocityX: number) => {
        gameState.ball.velocityX = velocityX;
    }//collisionBall detecting aingsnt machin evenement

    const ballAgainstBorder = (velocityY: number) => {
        gameState.ball.velocityY = velocityY;
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

    const initiatePaddle1 = (vel: number, socketId: string) => {
        gameState.paddle1.y = vel;
        gameState.paddle1.socket = socketId;
    }

    const initiatePaddle2 = (vel: number, socketId: string) => {
        gameState.paddle2.y = vel;
        gameState.paddle2.socket = socketId;
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
        requestAnimationFrame(update);
    };
    
    useEffect(() => {
        ////////////// LOOP FOR FRONTEND /////////////////////////
        update();

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
        socket.on('initplayer1', (newGameVel: number, socketId: string) => {
            initiatePaddle1(newGameVel, socketId);
        })

        socket.on('initplayer2', (newGameVel: number, socketId: string) => {
            initiatePaddle2(newGameVel, socketId);
        })

        socket.on('ballIsMoving', (data: {x: number, y: number}) => {
            if (data)
            {
                gameState.ball.x = data.x;
                gameState.ball.y = data.y;
            }
        })

        socket.on('updateScoreP1', (data: {scoreP1: number}) => {
            updateScorePlayer1(data.scoreP1);
        })

        socket.on('updateScoreP2', (data: {scoreP2: number}) => {
            updateScorePlayer2(data.scoreP2);
        })

        socket.on('detectCollisionW/Paddle', (velocityX: number) => {
            ballAgainstPaddle(velocityX);
        })//detecting Ball agaist paddles

        socket.on('detectBorder', (velocityY: number) => {
            ballAgainstBorder(velocityY);
        })//detecting Ball against border wall

        socket.on('winnerIs', (winner: string) => {
            setWinner(winner);
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
        }
        
    }, [update]);
    
    return (
        <div className="game-container">
            <canvas id="board"></canvas>
        </div>
  );
}

export default WebsocketSG;