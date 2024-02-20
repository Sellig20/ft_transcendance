import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameStateBD, Player} from "./gameStateBD";

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
        this.startGameLoop();
    }
    
    sendToPlayer(event: string, data: any) {
        this.server.to(this.player1.socketId).emit(event, data);
        this.server.to(this.player2.socketId).emit(event, data);
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
        if (this.gameState.player1Score >= 11) {
            this.gameState.player1Winner = true;
            this.sendToPlayer('winnerIs', { winner: this.gameState.idPlayer1 });
        }
        else if (this.gameState.player2Score >= 11) {
            this.gameState.player2Winner = true;
            this.sendToPlayer('winnerIs', { winner: this.gameState.idPlayer2 });
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
            console.log(" + 1 pour joueur 2 !");
            this.gameState.player2Score += 1;
            this.sendToPlayer('updateScoreP2', { scoreP2: this.gameState.player2Score });
            this.maxScore();
            this.resetBall(1);
        }
        else if (this.gameState.ball.x + this.gameState.ballWidth > this.gameState.boardWidth && !ballHitPaddle) {
            console.log(" + 1 pour joueur 1 !");
            this.gameState.player1Score += 1;
            this.sendToPlayer('updateScoreP1', { scoreP1: this.gameState.player1Score });
            this.maxScore();
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
            if (this.gameState.ball.x <= this.gameState.paddle1.x + this.gameState.paddle1.width) {
                this.gameState.ball.velocityX *= -1;
                ballHitPaddle = true;
            }
        }
        else if (this.detect(this.gameState.ball, this.gameState.paddle2)) {
            if (this.gameState.ball.x + this.gameState.ballWidth >= this.gameState.paddle2.x) {
                this.gameState.ball.velocityX *= -1;
                ballHitPaddle = true;
            }
        }
        this.sendToPlayer('detectCollisionW/Paddle', { x: this.gameState.ball.velocityX });
    }
    
    detectingBorder() {//borderCollision evenement
        if (this.gameState.ball.y <= 0 || this.gameState.ball.y + this.gameState.ball.height >= this.gameState.boardHeight) {
            this.gameState.ball.velocityY = -this.gameState.ball.velocityY;
            this.sendToPlayer('detectBorder', { x: this.gameState.ball.velocityY});
        }
    }
    
    initialisationBall() {
        this.gameState.ball.x += (this.gameState.ball.velocityX * this.gameState.currentLevel);
        this.gameState.ball.y += (this.gameState.ball.velocityY * this.gameState.currentLevel);
    }

    initialisationPaddle1() {
        // this.gameState.paddle1.socket = client.id;//met la socket du joueur dans son paddle
        this.gameState.paddle1.y += this.gameState.paddle1.velocityY;
        this.gameState.paddle1.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle1.height, this.gameState.paddle1.y));
        // const player2.socketId = this.getOpponentSocket(client.id);
        this.server.to(this.player2.socketId).emit('initplayer1', this.gameState.paddle1.y, 
            this.gameState.paddle1.socket);
        this.server.to(this.player1.socketId).emit('initplayer1', this.gameState.paddle1.y, 
        this.gameState.paddle1.socket);
    }

    initialisationPaddle2() {
        // this.gameState.paddle2.socket = this.player1.socket;//met la socket du joueur dans son paddle
        this.gameState.paddle2.y += this.gameState.paddle2.velocityY;
        this.gameState.paddle2.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle2.height, this.gameState.paddle2.y));
        // const player2.socketId = this.getOpponentSocket(this.player1.socket);
        this.server.to(this.player1.socketId).emit('initplayer2', this.gameState.paddle2.y, 
            this.gameState.paddle2.socket);
        this.server.to(this.player1.socketId).emit('initplayer2', this.gameState.paddle2.y, 
            this.gameState.paddle2.socket);
    }
    
    startGameLoop(): void {
        setInterval(() => {
            this.initialisationBall();
            this.detectingBorder();
            let ballHitPaddle = false;
            this.detectingCollisionWithPaddle(ballHitPaddle);
            this.ScoreAndResetBall(1, ballHitPaddle);
            this.sendToPlayer('ballIsMoving', { x: this.gameState.ball.x, y: this.gameState.ball.y });
        }, 16); // 16 ms (environ 60 FPS)
    }

}










      //     console.log("***** 1 ******** ", this.player1.socketId);
        //     console.log("****** 2 ******* ", this.player2.socketId);
        //     console.log("***** 3 ******** ", this.gameId);
        // }
        // else if (this.player1 && player1.socketId && this.player1.socketId === player1.socketId) {
        //     console.log("player 1 non undefned mais pareil ");
        //     return ;
        // }
        // else if (this.player1 && player1.socketId && this.player1.socketId !== player1.socketId){
            
        //     console.log("player 1 non undefned mais diff ");
        //     this.player1 = player1;
        // }
        // else if (this.player2 && player2.socketId && this.player2.socketId === player2.socketId) {
        //     console.log("player 2 non undefned mais pareil ");
        //     return ;
        // }
        // else if (this.player2 && player2.socketId && this.player2.socketId !== player2.socketId){
        //     this.player2 = player2;
        //     this.server = server;
        //     this.gameId = Id;
        //     this.gameState = this.initializeGameState();
        //     console.log("***** 1 ******** ", this.player1.socketId);
        //     console.log("****** 2 ******* ", this.player2.socketId);
        //     console.log("***** 3 ******** ", this.gameId);
        //     console.log("player 2 non undefned mais diff ");
        //     // this.player1 = player1;
        // }
        // else
        //     return;


            // constructor(gameId: string, player1: Player, player2: Player) {
            //     this.gameId = gameId;
            //     this.player1 = player1;
            //     this.player2 = player2;
            //   }
