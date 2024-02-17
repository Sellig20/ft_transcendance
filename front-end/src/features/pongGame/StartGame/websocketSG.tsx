import { useContext, useEffect, useState, useRef } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"
import { GameStateFD } from "./GameStateFD";

export const WebsocketSG = () => {

    const socket = useContext(WebsocketContext);
    const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [gameState, setGameState2] = useState<GameStateFD>(new GameStateFD());

    const setWinner = (winnerIs: boolean, winnerIdentity: string) => {
        if (winnerIs === true && winnerIdentity === "one") {
            gameState.player1Winner = true;
        }
        else if (winnerIs === true && winnerIdentity === "two") {
            gameState.player2Winner = true;
        }
    }

    const updateScorePlayer2 = (data: number) => {
        gameState.player2Score = data;
    }

    const updateScorePlayer1 = (data: number) => {
        gameState.player1Score = data;
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

    const getCanvasTheContext = () => {
        return canvasContextRef.current;
    }

    const renvoiBallData = (updateBallData: GameStateFD) => {
        const context = getCanvasTheContext();
        if (context) {
            context.clearRect(0, 0, gameState.boardWidth, gameState.boardHeight);
            updateBallData.ball.x += updateBallData.ball.velocityX;
            updateBallData.ball.y += updateBallData.ball.velocityY;
        }
    }
    
    const drawBall = (context: CanvasRenderingContext2D) => {
        context.fillStyle = "pink";
        context.beginPath();
        // context.arc(gameState.ball.x, gameState.ball.y, gameState.ball.width / 2, 0, 2 * Math.PI);
        context.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball.width, gameState.ball.height);
        context.fill();
    }

    const ballReceptionServer = (ball: number) => {
        gameState.ball.velocityX = ball;
    }//collisionBall detecting aingsnt machin evenement

    const ballCollisionBorder = (ball: number) => {
        gameState.ball.velocityY = ball;
    }//borderCollision detecting borderevenemt

    const initiateBall = (ballX: number, ballY: number) => {
        gameState.ball.x = ballX;
        gameState.ball.y = ballY;
    }

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

    const initiatePaddle1 = (data: number) => {
        gameState.paddle1.y = data;
    }

    const initiatePaddle2 = (data: number) => {
        gameState.paddle2.y = data;
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
        update();

        const handleConnect = () => {
            console.log('Connected in START GAME!');
            
        }
        socket.on('connect', handleConnect);
        if (socket.connected) {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
        }

        socket.emit('handleInit1');
        socket.emit('handleInit2');
        socket.emit('handleInitBallAndGame');
        
        const userId = 1;
        const makeMovePaddle1 = (newVelocityY: number) => {
            // console.log("velocity en recepton = ", newVelocityY);
        }
        const makeMovePaddle2 = (newVelocityY: number) => {
            // console.log("velocity en recepton = ", newVelocityY);
        }
        
        const handleKeyDown = (event: KeyboardEvent) => {
            
            if (event.key === 'ArrowUp') {
                if (userId === 1) {
                    socket.emit('keyupPD1', { key: event.code })
                        socket.on('paddle1Moved', (newVelocityY: number) => {
                        makeMovePaddle1(newVelocityY);
                    })
                    console.log(`Arrow UP by ${userId}`);
                    
                } else if (userId === 2) {
                    socket.emit('keyupPD2', { key: event.code })
                    socket.on('paddle2Moved', (newVelocityY: number) => {
                        makeMovePaddle2(newVelocityY);
                    })
                    console.log(`Arrow UP by ${userId}`);
                }
            }
            else if (event.key === 'ArrowDown') {
                if (userId === 1) {
                    socket.emit('keydownPD1', { key: event.code })
                    socket.on('paddle1Moved', (newVelocityY: number) => {
                        makeMovePaddle1(newVelocityY);
                    })
                    console.log(`Arrow DOWN by ${userId}`);
                } else if (userId === 2) {
                    socket.emit('keydownPD2', { key: event.code })
                    socket.on('paddle2Moved', (newVelocityY: number) => {
                        makeMovePaddle2(newVelocityY);
                    })
                    console.log(`Arrow DOWN by ${userId}`);
                }
            }
        }; 

        window.addEventListener('keydown', handleKeyDown);
        // socket.on('sendCanvasToServer', sendCanvasToServer);

        //quand je reviens du serveur. le serveur renvoie :
        socket.on('initplayer1', (newGameState: number) => {
            initiatePaddle1(newGameState);
        })

        socket.on('initplayer2', (newGameState: number) => {
            initiatePaddle2(newGameState);
        })

        socket.on('updatePlayer2', (newGameState: number) => {
            updateScorePlayer2(newGameState);
        })

        socket.on('updatePlayer1', (newGameState: number) => {
            updateScorePlayer1(newGameState);
        })

        socket.on('initBall', (ball: number, bally: number) => {
            initiateBall(ball, bally);
        })

        socket.on('collisionBall', (ball: number) => {
            ballReceptionServer(ball);
        })//detecting B agaist

        socket.on('borderCollision', (ball: number) => {
            ballCollisionBorder(ball);
        })//detecting border

        socket.on('winnerIs', (winnerIs: boolean, winnerIdentity: string) => {
            setWinner(winnerIs, winnerIdentity);
        })

        return () => {
            console.log("Unregistering events...");  
            socket.off('connect');
            window.removeEventListener('keydown', handleKeyDown);
            socket.off('updatePaddle1');
            socket.off('updatePaddle2');
            // socket.off('sendCanvasToServer', sendCanvasToServer);
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