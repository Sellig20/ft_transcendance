import './style.css'
import React, { useEffect } from 'react';
import PGame from '../../components/PGame/index';


const PongGame: React.FC = () => {

    const gameBoard = document.querySelector("#gameBoard") as HTMLCanvasElement | null;;
    const resetButton = document.querySelector("resetBtn");
    const scoreText = document.querySelector("#scoreText");
    
    if (gameBoard)
    {
        const ctx = gameBoard.getContext("2d");
        const gameWidth = gameBoard.width;
        const gameHeight = gameBoard.height;
        const boardBackground = "forestgreen";
        const paddle1Color = "lightblue";
        const paddle2Color = "red";
        const paddleBorder = "black";
        const BallColor = "yellow";
        const ballBorderColor = "black";
        const ballRadius = 12.5;
        const paddleSpeed = 50;
        let intervalID;
        let ballSpeed = 1;
        let ballX = gameWidth / 2;
        let ballY = gameHeight / 2;
        let ballXDirection = 0;
        let ballYDirection = 0;
        let player1Score = 0;
        let player2Score = 0;

        let paddle1 = {
            width: 25,
            height: 100,
            x: 0,
            y: 0
        }
        let paddle2 = {
            width: 25,
            height: 100,
            x: gameWidth - 25,
            y: gameHeight - 100
        }
        
    }
        
        useEffect(() => {
        window.addEventListener("keydown", changeDirection);
        resetButton?.addEventListener("click", resetGame);

        gameStart();

        return () => {
            window.removeEventListener("keydown", changeDirection);
            resetButton?.removeEventListener("click", resetGame);
        };
    }, []);

        gameStart();

        function gameStart(){};
        function nextTick(){};
        function clearBoard(){};
        function drawPaddles(){};
        function createBall(){};
        function moveBall(){};
        function checkCollision(){};
        function changeDirection(){};
        function updateScore(){};
        function resetGame(){};

    return (
        <div id="gameContainer">
            <h1>PONG GAME</h1>
            <canvas id="gameBoard" width="500" height="500"></canvas>
            <div id="scoreText">0 : 0</div>
            <button id="resetButton">Reset</button>
            <PGame />

        </div>
    )
}

export default PongGame;