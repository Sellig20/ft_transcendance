import { useContext, useEffect, useState, useRef } from "react"
import { GameStateFD, GameStatus } from "./GameStateFD";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { Rootstate } from "../../app/store";
    
export const WebSocketSG = ({ socket, page}) => {

    // const userid = useSelector((state: Rootstate) => state.user.id);
    const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [gameState, setGameState2] = useState<GameStateFD>(new GameStateFD());
    const navigate = useNavigate();

    const updateScorePlayer1 = (scoreP1: number) => {
        gameState.player1Score = scoreP1;
    }

    const updateScorePlayer2 = (scoreP2: number) => {
        gameState.player2Score = scoreP2;
    }

    const partyAbandon = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        if (gameState.player1Abandon === true || gameState.player2Abandon === true)
        {
            partyIsAbandonned(context, board);
            gameState.status === GameStatus.abortedGame;
        }
        if (gameState.player1IsDeserted === true || gameState.player2IsDeserted === true)
        {
            partyIsDeserted(context, board);
            gameState.status === GameStatus.abortedGame;
        }
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
            canvasContextRef.current = context;
            return context;
        }
        return null;
    }

    const displayEndGame = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        gameState.status === GameStatus.finishedGame;
        if (gameState.mapChoiceLocked === 2)
            context.fillStyle = '45 px #7CFC00';
        else
            context.fillStyle = '#9900ff';
        context.font = '30px "Press Start 2P", sans-serif';
        context.textAlign = 'center';
        context.fillText('CONGRATS YOU WON', board.width / 2, board.height / 2);
        setTimeout(getBack, 1000);
    }
    
    const displayFailGame = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        gameState.status === GameStatus.finishedGame;
        if (gameState.mapChoiceLocked === 2)
            context.fillStyle = '45 px #00BFFF';
        else
            context.fillStyle = '#9900ff';
        context.font = '50px "Press Start 2P", sans-serif';
        context.textAlign = 'center';
        context.fillText('LOOOOOSER', board.width / 2, board.height / 2);
        setTimeout(getBack, 1000);
    }
    
    const partyIsAbandonned = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        context.strokeStyle = 'rgb(190, 154, 240)';
        if (gameState.mapChoiceLocked === 2)
            context.fillStyle = '45 px #1E90FF';
        else
            context.fillStyle = '65 px #a300e6';
        context.font = '20px "Press Start 2P", sans-serif';
        context.textAlign = 'center';
        context.fillText('YOU GAVE UP', board.width / 2, board.height / 2);
    }
    
    const partyIsDeserted = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        gameState.status === GameStatus.abortedGame;
        context.strokeStyle = 'rgb(190, 154, 240)';
        if (gameState.mapChoiceLocked === 2)
            context.fillStyle = '45 px #FF1493';
        else
            context.fillStyle =  '45 px #a300e6';
        context.font = '20px "Press Start 2P", sans-serif';
        context.textAlign = 'center';
        context.fillText('ABANDON OF YOUR OPPONENT', board.width / 2, board.height / 2);
    }

    const displayScore = (context: CanvasRenderingContext2D) => {
        if (gameState.mapChoiceLocked === 2)
            context.fillStyle = '#FF8C00';
        else
            context.fillStyle = '#9900ff';
        context.font = '40px "Press Start 2P", sans-serif';
        context.fillText(gameState.player1Score.toString(), gameState.boardWidth / 5, 45);
        context.fillText(gameState.player2Score.toString(), gameState.boardWidth * 4 / 5 - 45, 45);
    }

    const displayLine = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        if (gameState.mapChoiceLocked === 2)
            context.fillStyle = '#FF8C00';
        else
            context.fillStyle = '#9966ff';
        context.font = '55px "Press Start 2P", sans-serif';
        for (let i = 10; i < board.height; i += 25) {
            context.fillRect(board.width / 2 - 10, i, 5, 5);
        }
    }
    
    const drawBall = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        if (gameState.mapChoiceLocked === 2)
            context.fillStyle = '#FFFF00';
        else
            context.fillStyle = '9900ff';
        context.beginPath();
        context.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball.width, gameState.ball.height);
        context.fill();
    }
    
    const drawPaddle1 = (context: CanvasRenderingContext2D) => {
        if (gameState.mapChoiceLocked === 2)
            context.fillStyle = '#FF8C00';
        else
            context.fillStyle = '9900ff';
        context.beginPath();
        context.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.paddle1.width, gameState.paddle1.height);
        context.fill();
    }

    const drawPaddle2 = (context: CanvasRenderingContext2D) => {
        if (gameState.mapChoiceLocked === 2)
            context.fillStyle = '#FF8C00';
        else
            context.fillStyle = '9900ff'; //'#9932CC'
        context.beginPath();
        context.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.paddle2.width, gameState.paddle2.height);
        context.fill();
    }

    const initiateBallX = (x: number, y: number, idG: string) => {
        gameState.ball.x = x;
        gameState.ball.y = y;
    }

    const initiatePaddle1 = (y: number, socketPlayer: string) => {
        gameState.paddle1.y = y;
        gameState.paddle1.socket = socketPlayer;
    }

    const initiatePaddle2 = (y: number, socketPlayer: string) => {
        gameState.paddle2.y = y;
        gameState.paddle2.socket = socketPlayer;
    }

    let time = 0;
    const update = () => {
        const board = createBoardGame();
        if (board) {
            const context = createContextCanvas(board);
            if (context) {
                context.clearRect(0, 0, board.width, board.height);// Efface le contenu du canvas
                context.fillStyle = '#9900ff';
                if (gameState.mapChoiceLocked === 2) {
                    drawWaves(time, context);
                }
                displayLine(context, board);
                displayScore(context);
                drawPaddle1(context);
                drawPaddle2(context);
                drawBall(context, board);
                if (gameState.player1Winner === true || gameState.player2Winner === true) {
                    displayEndGame(context, board);
                    console.log("je serais donc bloque en display end?")
                }
                if (gameState.player1Looser === true || gameState.player2Looser === true) {
                    displayFailGame(context, board);
                    console.log("je serais donc bloque en display fail?")
                }
                partyAbandon(context, board);
                if (gameState.status === GameStatus.abortedGame || gameState.status === GameStatus.finishedGame || 
                    gameState.status === GameStatus.over)
                {
                    console.log("ca va bouger 3 2 1...");
                    setTimeout(getBack, 1000);
                }
                time += 0.5;
                requestAnimationFrame(update);
            }
        }
    };

    const handleAbandon = () => {
        socket?.emit('Abandon', socket?.id);
    }

    const handleCrash = () => {
        socket?.emit('Crash', socket?.id);
    }

    const getBack = () => {
        navigate('../')
    }

    const drawWaves = (time: number, context: CanvasRenderingContext2D) => {

        const waveColors = ['#ff6347', '#6495ed', '#00ced1', '#ff69b4', '#32cd32'];

        for (let i = 0; i < waveColors.length; i++) {
          const offset = i * 20;
          context.fillStyle = waveColors[i];
          context.beginPath();
          for (let x = 0; x < gameState.boardWidth; x += 10) {
            const y = Math.sin((x + time + offset) * 0.01) * 50 + gameState.boardHeight / 2;
            context.lineTo(x, y);
          }
          
        context.lineTo(gameState.boardWidth, gameState.boardHeight);
        context.lineTo(0, gameState.boardHeight);
        context.closePath();
        context.fill();
        }
    };

    useEffect(() => {
        ////////////// LOOP FOR FRONTEND /////////////////////////
        const animationId = requestAnimationFrame(update);
        ////////////// AU LANCEMENT DE START GAME //////////////

        const handleConnect = () => {
            console.log('Connected in START GAME!');
        }

        const handleDisconnect = () => {
            console.log("a quittey la zooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooone");
        }

        if (socket?.connected) {
            console.log(`je suis ${socket.id} dans start gate .tsx`);
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            socket?.emit('keydown', {key: event.code})
        }; 

        window.addEventListener('keydown', handleKeyDown);
        socket?.on('disconnect', handleDisconnect)

        ///////////////////// SERVEUR RENVOIE donc le FRONTEND ECOUTE : ////////////////////////////

        socket?.on('initplayer1', (y: number, idGame: string) => {
            initiatePaddle1(y, idGame);
        })

        socket?.on('initplayer2', (y: number, idGame: string) => {
            initiatePaddle2(y, idGame);
        })

        socket?.on('ballIsMovingX', (x: number, y: number, idGame: string) => {
            initiateBallX(x, y, idGame);
        })

        socket?.on('updateScoreP1', (scoreP1: number) => {
            updateScorePlayer1(scoreP1);
        })

        socket?.on('updateScoreP2', (scoreP2: number) => {
            updateScorePlayer2(scoreP2);
        })

        socket?.on('choiceMap', (mapChoice: number) => {
            gameState.mapChoiceLocked = mapChoice;
        })

        socket?.on('winner', (name: string) => {
            if (name === "one")
            {
                gameState.player1Winner = true;
                gameState.player2Winner = false;
            }
            else if (name === "two")
            {
                gameState.player2Winner = true;
                gameState.player1Winner = false;
            }
        })

        socket?.on('looser', (name: string) => {
            if (name === "one")
                gameState.player1Looser = true;
            else if (name === "two")
                gameState.player2Looser = true;
        })
        
        socket?.on('IGaveUp', (name: string) => {
            gameState.status = GameStatus.abortedGame;
            if (name === "one")
                gameState.player1Abandon = true;
            else if (name === "two")
                gameState.player2Abandon = true;
        })

        socket?.on('HeGaveUp', (name: string) => {
            gameState.status = GameStatus.abortedGame;
            if (name === "one")
                gameState.player1IsDeserted = true;
            else if (name === "two")
                gameState.player2IsDeserted = true;
        })

        socket?.on('GameOver', (socketClient: string, gameId: string) => {
            socket?.emit('IsFinished', socketClient);
        })

        socket?.on('oppo-crashed', (socket: string) => {
            if (socket === gameState.paddle1.socket) {
                gameState.player2IsDeserted = true;
                gameState.status = GameStatus.abortedGame;
                handleCrash();
            }
            else if (socket === gameState.paddle2.socket) {
                gameState.player1IsDeserted = true;
                gameState.status = GameStatus.abortedGame;
                handleCrash();
            }
        })

        return () => {
            console.log("Unregistering events SG");
            socket?.off('connect');
            socket?.off('disconnect');
            window.removeEventListener('keydown', handleKeyDown);
            socket?.off('initplayer1');
            socket?.off('initplayer2');
            socket?.off('ballIsMovingX');
            socket?.off('updateScoreP1');
            socket?.off('updateScoreP2');
            socket?.off('detectCollisionW/Paddle');
            socket?.off('detectBorder');
            socket?.off('winnerIs');
            socket?.off('congrats');
            socket?.off('oppo-crashed');
            socket?.off('GameOver');
            socket?.off('HeGaveUp');
            socket?.off('looser');
            socket?.off('HeGaveUp');
            socket?.off('IGaveUp');
            socket?.off('winner');
            socket?.off('choiceMap');
            gameState.status = GameStatus.finishedGame;
            socket?.emit('finito');
            cancelAnimationFrame(animationId);
        }
    }, [update]);
    
    return (
        <div>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
                />
                <div className="SG mt-4">
                    <div className="jumbotron mt-4">
                        <canvas id="board">
                        </canvas>
                        <div className="row">
                            <button className="buttonGame" onClick={handleAbandon}>
                                <span>Abandon Game</span></button>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default WebSocketSG;