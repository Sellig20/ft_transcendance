import { useContext, useEffect, useState, useRef } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"
import { GameStateFD, GameStatus } from "./GameStateFD";
import { useNavigate } from "react-router-dom";

export const WebsocketSG = () => {

    const socket = useContext(WebsocketContext);
    const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [gameState, setGameState2] = useState<GameStateFD>(new GameStateFD());
    const navigate = useNavigate();

    const updateScorePlayer1 = (scoreP1: number) => {
        gameState.player1Score = scoreP1;
    }

    const updateScorePlayer2 = (scoreP2: number) => {
        gameState.player2Score = scoreP2;
    }

    const displayScore = (context: CanvasRenderingContext2D) => {
        context.fillStyle = '#9900ff';
        context.font = '40px "Press Start 2P", sans-serif';
        context.fillText(gameState.player1Score.toString(), gameState.boardWidth / 5, 45);
        context.fillText(gameState.player2Score.toString(), gameState.boardWidth * 4 / 5 - 45, 45);
    }

    const displayLine = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        context.fillStyle = '#a35ce6';
        context.font = '55px "Press Start 2P", sans-serif';
        for (let i = 10; i < board.height; i += 25) {
                context.fillRect(board.width / 2 - 10, i, 5, 5);
            }
    }

    const displayEndGame = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        context.fillStyle = '#9900ff';
        context.font = '35px "Press Start 2P", sans-serif';
        context.textAlign = 'center';
        context.fillText('CONGRATS YOU WON', board.width / 2, board.height / 2);
    }

    const displayFailGame = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        context.fillStyle = '#9900ff';
        context.font = '50px "Press Start 2P", sans-serif';
        context.textAlign = 'center';
        context.fillText('LOOOOOSER', board.width / 2, board.height / 2);
    }

    const partyAbandon = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        if (gameState.player1Abandon === true || gameState.player2Abandon === true)
        {
            partyIsAbandonned(context, board);
        }
        if (gameState.player1IsDeserted === true || gameState.player2IsDeserted === true)
        {
            partyIsDeserted(context, board);
        }
        gameState.status === GameStatus.abortedGame;
    }
    
    const partyIsAbandonned = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        context.strokeStyle = 'rgb(190, 154, 240)';
        context.fillStyle = '65 px #a300e6';
        context.font = '20px "Press Start 2P", sans-serif';
        context.textAlign = 'center';
        context.fillText('YOU GAVE UP', board.width / 2, board.height / 2);
    }

    const partyIsDeserted = (context: CanvasRenderingContext2D, board: HTMLCanvasElement) => {
        context.strokeStyle = 'rgb(190, 154, 240)';
        context.fillStyle =  '45 px #a300e6';
        context.font = '20px "Press Start 2P", sans-serif';
        context.textAlign = 'center';
        context.fillText('ABANDON OF YOUR OPPONENT', board.width / 2, board.height / 2);
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
        context.fillStyle = '#cc00ff';
        context.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball.width, gameState.ball.height);
        context.fill();
    }

    const ballAgainstPaddle = (velX: number, velY: number) => {
        gameState.ball.velocityX = velX;
        gameState.ball.velocityY = velY;
    }//collisionBall detecting aingsnt machin evenement

    const ballAgainstBorder = (velY: number) => {
        gameState.ball.velocityY = velY;
    }//borderCollision detecting borderevenemt

    const drawPaddle1 = (context: CanvasRenderingContext2D) => {
        context.fillStyle = '#9900ff';
        context.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.paddle1.width, gameState.paddle1.height);
        context.fill();
    }

    const drawPaddle2 = (context: CanvasRenderingContext2D) => {
        context.fillStyle = '#9900ff';
        context.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.paddle2.width, gameState.paddle2.height);
        context.fill();
    }

    const initiateBallX = (x: number, y: number, idG: string) => {
        gameState.ball.x = x;
        gameState.ball.y = y;
    }

    const initiatePaddle1 = (y: number, idG: string) => {
        gameState.paddle1.y = y;
    }

    const initiatePaddle2 = (y: number, idG: string) => {
        gameState.paddle2.y = y;
    }

    const update = () => {
        const board = createBoardGame();
        if (board) {
            const context = createContextCanvas(board);
            if (context) {
                context.clearRect(0, 0, board.width, board.height);// Efface le contenu du canvas
                context.fillStyle = '#9900ff';
                displayScore(context);
                if (gameState.player1Winner === true || gameState.player2Winner === true) {
                    displayEndGame(context, board);
                    gameState.status === GameStatus.finishedGame;
                }
                if (gameState.player1Looser === true || gameState.player2Looser === true) {
                    displayFailGame(context, board);
                    gameState.status === GameStatus.finishedGame;
                }
                partyAbandon(context, board);
                if (gameState.status === GameStatus.abortedGame || gameState.status === GameStatus.finishedGame)
                {
                    // alert("Vous allez être redirigé dans quelques secondes...");
                    setTimeout(getBack, 3000);
                }
                drawPaddle1(context);
                drawPaddle2(context);
                drawBall(context);
                displayLine(context, board);
                requestAnimationFrame(update);
            }
        }
    };

    const handleAbandon = () => {
        socket.emit('Abandon', socket.id);
    }

    const getBack = () => {
        navigate('../')
    }

    useEffect(() => {
        ////////////// LOOP FOR FRONTEND /////////////////////////
        const animationId = requestAnimationFrame(update);
        ////////////// AU LANCEMENT DE START GAME //////////////
        const handleConnect = () => {
            console.log('Connected in START GAME!');
        }

        const handleDisconnect = () => {
            socket.emit('quitInGame');
        }

        if (socket.connected) {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            socket.emit('keydown', {key: event.code})
        }; 

        socket.on('connect', handleConnect);
        window.addEventListener('keydown', handleKeyDown);
        socket.on('disconnect', handleDisconnect);
        ///////////////////// SERVEUR RENVOIE donc le FRONTEND ECOUTE : ////////////////////////////
        socket.on('initplayer1', (y: number, idGame: string) => {
            console.log("paddle 1 y : ", y);
            initiatePaddle1(y, idGame);
        })

        socket.on('initplayer2', (y: number, idGame: string) => {
            console.log("paddle 2 y : ", y);
            initiatePaddle2(y, idGame);
        })

        socket.on('ballIsMovingX', (x: number, y: number, idGame: string) => {
            console.log("ball x : ", x, " | ball y :", y);
            initiateBallX(x, y, idGame);
        })

        socket.on('updateScoreP1', (scoreP1: number) => {
            console.log(" update socre player 1 : ", scoreP1);
            updateScorePlayer1(scoreP1);
        })

        socket.on('updateScoreP2', (scoreP2: number) => {
            console.log(" update socre player 1 : ", scoreP2);
            updateScorePlayer2(scoreP2);
        })

        socket.on('detectCollisionW/Paddle', (velX: number, velY: number) => {
            ballAgainstPaddle(velX, velY);
        })//detecting Ball agaist paddles

        socket.on('detectBorder', (velY: number) => {
            ballAgainstBorder(velY);
        })//detecting Ball against border wall

        socket.on('winner', (name: string) => {
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

        socket.on('looser', (name: string) => {
            if (name === "one")
                gameState.player1Looser = true;
            else if (name === "two")
                gameState.player2Looser = true;
        })
        
        socket.on('IGaveUp', (name: string) => {
            // partie over
            // -1 dans le big tableau
            // getPlayer de la bdd
            
            //L'ABANDONNEUR
            
            gameState.status = GameStatus.abortedGame;
            if (name === "one")
                gameState.player1Abandon = true;
            else if (name === "two")
                gameState.player2Abandon = true;
        })

        socket.on('HeGaveUp', (name: string) => {
            // partie over 
            // +1 he aba
            // getPlayer de la bdd
            
            //he gave up donc envoie d'un display de tu as gagne prke il a abandon

            //L'ABANDONNE
            gameState.status = GameStatus.abortedGame;
            if (name === "one")
                gameState.player1IsDeserted = true;
            else if (name === "two")
                gameState.player2IsDeserted = true;
        })

        return () => {
            console.log("Unregistering events...");
            socket.off('connect');
            socket.off('disconnect');
            window.removeEventListener('keydown', handleKeyDown);
            socket.off('initplayer1');
            socket.off('initplayer2');
            socket.off('ballIsMovingX');
            socket.off('updateScoreP1');
            socket.off('updateScoreP2');
            socket.off('detectCollisionW/Paddle');
            socket.off('detectBorder');
            socket.off('winnerIs');
            socket.off('congrats');
            // clearInterval(idInterval);
            cancelAnimationFrame(animationId);
        }
    }, [update]);
    
    return (
        <div className="page-container">
             <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
            />
            <div className="game-container">
                <canvas id="board"></canvas>
            </div>
            <div className="button-container">
                <button className="buttonGame" onClick={handleAbandon}>
                    <span>Abandon Game</span>
                </button>
            </div>
    </div>
  );
}

export default WebsocketSG;