import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameStateBD} from "./gameStateBD";

export class Game {
    
    private userArray: string[] = [];
    private gameState: GameStateBD = new GameStateBD();

    constructor() {
    }

    maxScore() {
        console.log("max SCORE");
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
    
    getConnectedUsers(): string[] {
        return Array.from(this.userArray);
    }
    
    private displayUserArray(): void {
        console.log("-------------------------------");
        this.userArray.forEach((item, index) => {
            console.log(`item [${item}] | index ${index}`);
        })
        console.log("-------------------------------");
    }
    
    private addUser(item: string): void {
        this.userArray.push(item);
        const index = this.userArray.indexOf(item);
        console.log(`Le client ajoute est => ${item} pour index : ${index}`);
    }
    
    private removeUser(userId: string): void {
        const indexToRemove = this.userArray.indexOf(userId);
        if (indexToRemove !== -1) {
            this.userArray.splice(indexToRemove, 1);
        }
    }
}
    
