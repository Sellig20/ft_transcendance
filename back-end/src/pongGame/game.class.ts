import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameStateBD, Player} from "./gameStateBD";

export class Game {
    
    // private userArray: string[] = [];
    private gameState: GameStateBD = new GameStateBD();
    private gameId: string;
    private server: Server;
    private player1: Player;
    private player2: Player;
    private boolAct: boolean = false;

    constructor(Id: string, server: Server, player1: Player, player2: Player) {
        this.server = server;
        if (!this.player1 && !this.player2) 
        {
            console.log("undefined 1 et 2");
            this.player1 = player1;
            this.player2 = player2;
            this.server = server;
            this.gameId = Id;
            console.log("***** 1 ******** ", this.player1.socketId);
            console.log("****** 2 ******* ", this.player2.socketId);
            console.log("***** 3 ******** ", this.gameId);
        }
        else if (this.player1 && player1.socketId && this.player1.socketId === player1.socketId) {
            console.log("player 1 non undefned mais pareil ");
            return ;
        }
        else if (this.player1 && player1.socketId && this.player1.socketId !== player1.socketId){
            
            console.log("player 2 non undefned mais diff ");
            this.player1 = player1;
            // this.player1 = player1;
        }
        else if (this.player2 && player2.socketId && this.player2.socketId === player2.socketId) {
            console.log("player 2 non undefned mais pareil ");
            return ;
        }
        else if (this.player2 && player2.socketId && this.player2.socketId !== player2.socketId){
            this.player2 = player2;
            this.server = server;
            this.gameId = Id;
            console.log("***** 1 ******** ", this.player1.socketId);
            console.log("****** 2 ******* ", this.player2.socketId);
            console.log("***** 3 ******** ", this.gameId);
            console.log("player 2 non undefned mais diff ");
            // this.player1 = player1;
        }
        else
            return;
    }

    actualDataInClassGame() {
        console.log("game id => ", this.gameId);
    }
    
    start() {
        // this.server.emit('prepareForMatch');
        this.sendToPlayer("prepareForMatch", {});
    }

    sendToPlayer(event: string, data: any) {
        this.server.emit(event, data);
    }

    getGameId(): string {
        return this.gameId;
    }

    getPlayer1Id() : string {
        return this.player1.socketId;
    }

    getPlayer2Id() : string {
        return this.player2.socketId;
    }

    maxScore() {
        console.log("mas SCORE");
        if (this.gameState.player1Score >= 11) {
            this.gameState.player1Winner = true;
            // this.server.emit('winnerIs', this.gameState.player1Winner, this.gameState.idPlayer1);
        }
        else if (this.gameState.player2Score >= 11) {
            console.log("Score player 2 atteint");
            this.gameState.player2Winner = true;
            // this.server.emit('winnerIs', this.gameState.player2Winner, this.gameState.idPlayer2);
        }
    }
    
    initialisationBallMove() {
        this.gameState.ball.x += (this.gameState.ball.velocityX * this.gameState.currentLevel);
        this.gameState.ball.y += (this.gameState.ball.velocityY * this.gameState.currentLevel);
    }
    
    detect(a: any, b: any) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
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
            // this.handleCollisionWithLeftBorder();
            this.resetBall(1);
        }
        else if (this.gameState.ball.x + this.gameState.ballWidth > this.gameState.boardWidth && !ballHitPaddle) {
            // this.handleCollisionWithRightBorder();
            this.resetBall(-1);
        }
    }
    
    detectingBallAgainstPaddle(ballHitPaddle: boolean) {
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
    }
    
    detectingBorder() {//borderCollision evenement
        if (this.gameState.ball.y <= 0 || this.gameState.ball.y + this.gameState.ball.height >= this.gameState.boardHeight) {
            this.gameState.ball.velocityY = -this.gameState.ball.velocityY;
        }
    }

    startGameLoop(): void {
        setInterval(() => {
        //  handleInitialisationPlayer1();
        // this.handleInitialisationPlayer2();
        this.initialisationBallMove();
        this.detectingBorder();
        // this.server.emit('borderCollision', this.gameState.ball.velocityY)
        let ballHitPaddle = false;
        this.detectingBallAgainstPaddle(ballHitPaddle);
        // this.server.emit('collisionBall', this.gameState.ball.velocityX)
        this.ScoreAndResetBall(1, ballHitPaddle);
        // this.server.emit('initplayer1', this.gameState.paddle1.y)
        // this.server.emit('initplayer2', this.gameState.paddle2.y)
        // this.server.emit('initBall', this.gameState.ball.x, this.gameState.ball.y)
        }, 16); // 16 ms (environ 60 FPS)
    }
    
    // getConnectedUsers(): string[] {
    //     return Array.from(this.userArray);
    // }
    
    
}
    
