import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameStateBD, Player, GameStatus} from "./gameStateBD";
import { exit } from "process";

export class Game {

    private gameState: GameStateBD;
    private gameId: string;
    private server: Server;
    private player1: Player;
    private player2: Player;
    private initializeGameState(): GameStateBD {
      const gameState = new GameStateBD();
      gameState.paddle1.socket = this.player1.socketId;
      gameState.paddle2.socket = this.player2.socketId;
      return gameState;
    }

    constructor(Id: string, server: Server, player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.server = server;
        this.gameId = Id;
        this.gameState = this.initializeGameState();
    }

    actualDataInClassGame() {
        console.log("game id => ", this.gameId);
    }

    start() {
        this.sendToPlayer("prepareForMatch", {});
        this.gameState.status = GameStatus.playingGame;
        this.startGameLoop();
    }

    sendToPlayer(event: string, data: any) {
        this.server.to(this.player1.socketId).emit(event, data);
        this.server.to(this.player2.socketId).emit(event, data);
    }

    sendToPlayerBall(event: string, data: any, data1: any) {
        this.server.to(this.player1.socketId).emit(event, data, data1);
        this.server.to(this.player2.socketId).emit(event, data, data1);
    }

    getGameId(): string {
        return this.gameId;
    }

    getGameObject() : GameStateBD {
        return this.gameState;
    }

    getPlayer1Id() : string {
        return this.player1.socketId;
    }

    getPlayer2Id() : string {
        return this.player2.socketId;
    }

    maxScore() {
        if (this.gameState.player1Score === 2) {
            console.log("Le gagnent est le joueur 1");
            this.server.to(this.player1.socketId).emit('winner', "one");
            this.server.to(this.player2.socketId).emit('looser', "two");
            this.gameState.status = GameStatus.finishedGame;
        }
        else if (this.gameState.player2Score === 2) {
            console.log("le gagnant est le joueur 2");
            this.server.to(this.player2.socketId).emit('winner', "two");
            this.server.to(this.player1.socketId).emit('looser', "one");
            this.gameState.status = GameStatus.finishedGame;
        }
    }

    resetBall(direction: number) {
        this.gameState.ball.x = this.gameState.boardWidth / 2 - this.gameState.ball.width / 2; // Replace la balle au centre horizontalement
        this.gameState.ball.y = this.gameState.boardHeight / 2 - this.gameState.ball.height / 2;
        this.gameState.ball.width = this.gameState.ballWidth;
        this.gameState.ball.height = this.gameState.ballHeight; // Replace la balle au centre verticalement
        this.gameState.ball.velocityX = direction;
        this.gameState.ball.velocityY = 2;
        this.gameState.ball.color = "red"
    }

    ScoreAndResetBall(direction: number, ballHitPaddle: boolean) {
        if (this.gameState.ball.x < 0 && !ballHitPaddle) {
            this.gameState.player2Score += 1;
            this.maxScore();
            this.sendToPlayer('updateScoreP2', this.gameState.player2Score );
            this.resetBall(1);
        }
        else if (this.gameState.ball.x + this.gameState.ballWidth > this.gameState.boardWidth && !ballHitPaddle) {
            this.gameState.player1Score += 1;
            this.maxScore();
            this.sendToPlayer('updateScoreP1', this.gameState.player1Score );
            this.resetBall(-1);
        }
    }

    detect(a: any, b: any) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    detectingCollisionWithPaddle(ballHitPaddle: boolean) {
        
        if (this.detect(this.gameState.ball, this.gameState.paddle1)) {
            console.log("collision 2 paddle 1");
            if (this.gameState.ball.x <= this.gameState.paddle1.x + this.gameState.paddle1.width) {
                console.log("collision 2 paddle 1");

                this.gameState.ball.velocityX *= -1;
                // Math.abs(this.gameState.ball.velocityX)
                ballHitPaddle = true;
                this.sendToPlayer('detectCollisionW/Paddle',  this.gameState.ball.velocityX );
            }
        }
        else if (this.detect(this.gameState.ball, this.gameState.paddle2)) {
            console.log("collision 1 paddle 2");
            if (this.gameState.ball.x + this.gameState.ballWidth >= this.gameState.paddle2.x) {
                console.log("collision 2 paddle 2");
                this.gameState.ball.velocityX *= -1;
                ballHitPaddle = true;
                this.sendToPlayer('detectCollisionW/Paddle',  this.gameState.ball.velocityX );
            }
        }
    }

    detectingBorder() {//borderCollision evenement
        if (this.gameState.ball.y <= 0 || this.gameState.ball.y + this.gameState.ball.height >= this.gameState.boardHeight) {
            this.gameState.ball.velocityY = -this.gameState.ball.velocityY;
            this.sendToPlayer('detectBorder', this.gameState.ball.velocityY);
        }
    }

    initialisationBall() {
        this.gameState.ball.x += (this.gameState.ball.velocityX * this.gameState.currentLevel);
        this.gameState.ball.y += (this.gameState.ball.velocityY * this.gameState.currentLevel);

        this.sendToPlayerBall('ballIsMovingX', this.gameState.ball.x, this.gameState.ball.y );
    }

    initialisationPaddle1() {
        this.gameState.paddle1.y += this.gameState.paddle1.velocityY;
        this.gameState.paddle1.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle1.height, this.gameState.paddle1.y));
       
        this.sendToPlayer('initplayer1', this.gameState.paddle1.y)
    }

    initialisationPaddle2() {
        this.gameState.paddle2.y += this.gameState.paddle2.velocityY;
        this.gameState.paddle2.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle2.height, this.gameState.paddle2.y));

        this.sendToPlayer('initplayer2', this.gameState.paddle2.y)
    }

    updatePaddle1() {
        this.gameState.paddle1.y += this.gameState.paddle1.velocityY;
        this.gameState.paddle1.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle1.height, this.gameState.paddle1.y));

        this.sendToPlayer('initplayer1', this.gameState.paddle1.y)
    }

    updatePaddle2() {
        this.gameState.paddle2.y += this.gameState.paddle2.velocityY;
        this.gameState.paddle2.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle2.height, this.gameState.paddle2.y));

        this.sendToPlayer('initplayer2', this.gameState.paddle2.y)
    }

    updateVelPaddle1(tmp: number) {
        this.gameState.paddle1.velocityY = tmp;
        // this.updatePaddle1();
        this.initialisationPaddle1();
    }

    updateVelPaddle2(tmp: number) {
        this.gameState.paddle2.velocityY = tmp;
        // this.updatePaddle2();
        this.initialisationPaddle2();
    }

    updateBall() {
        this.gameState.currentLevel = 1;
    }

    startGameLoop() {
        setInterval(() => {
            if ((this.gameState.status !== GameStatus.finishedGame) 
                && (this.gameState.status !== GameStatus.abortedGame)) {
                this.initialisationBall();
                this.initialisationPaddle1();
                this.initialisationPaddle2();
                this.detectingBorder();
                let ballHitPaddle = false;
                this.detectingCollisionWithPaddle(ballHitPaddle);
                this.ScoreAndResetBall(1, ballHitPaddle);
                // this.server.to(this.player1.socketId).emit('initplayer1', this.gameState.paddle1.x);
                // this.server.to(this.player1.socketId).emit('initplayer2', this.gameState.paddle2.x);
                // this.server.to(this.player1.socketId).emit('ballIsMovingX', this.gameState.ball.x, this.gameState.ball.y);

                // this.server.to(this.player2.socketId).emit('initplayer1', this.gameState.paddle1.x);
                // this.server.to(this.player2.socketId).emit('initplayer2', this.gameState.paddle2.x);
                // this.server.to(this.player2.socketId).emit('ballIsMovingX', this.gameState.ball.x, this.gameState.ball.y);
            }

        }, 16); // 16 ms (environ 60 FPS)
    }
}
