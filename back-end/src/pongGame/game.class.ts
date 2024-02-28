import { Server, Socket } from 'socket.io';
import { GameStateBD, Player, GameStatus} from "./gameStateBD";
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
      gameState.status = GameStatus.playingGame;
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
        this.sendToPlayer("prepareForMatch", {}, "jojo");
        this.gameState.status = GameStatus.playingGame;
        this.startGameLoop();
    }

    statusAbandon(socketClient: string) {
        this.gameState.status = GameStatus.abortedGame;
        if (socketClient === this.player1.socketId)
        {
            this.server.to(this.player1.socketId).emit('IGaveUp', this.gameState.idPlayer1);
            this.server.to(this.player2.socketId).emit('HeGaveUp', this.gameState.idPlayer2);
        }
        else if (socketClient === this.player2.socketId)
        {
            this.server.to(this.player1.socketId).emit('HeGaveUp', this.gameState.idPlayer1);
            this.server.to(this.player2.socketId).emit('IGaveUp', this.gameState.idPlayer2);
        }
    }

    sendToPlayer(event: string, data: any, id: string) {
        this.server.to(this.player1.socketId).emit(event, data, id);
        this.server.to(this.player2.socketId).emit(event, data, id);
    }

    sendToPlayerBall(event: string, data: any, data1: any, id: string) {
        this.server.to(this.player1.socketId).emit(event, data, data1, id);
        this.server.to(this.player2.socketId).emit(event, data, data1, id);
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

    //     chatService.getUserById(userid)
    //     const getUserById = async (iduser: number) => {
    //     const request = await api.get(/chat/getUserById/${iduser})
    //     return request.data
    // }

    maxScore() {
        if (this.gameState.player1Score === 30) {
            this.server.to(this.player1.socketId).emit('winner', "one");
            this.server.to(this.player2.socketId).emit('looser', "two");
            this.gameState.status = GameStatus.finishedGame;
            this.gameState.player1Winner = true;
            this.gameState.player2Looser = true;
            //AXIOS requetes gagnant player 1
        }
        else if (this.gameState.player2Score === 30) {
            this.server.to(this.player2.socketId).emit('winner', "two");
            this.server.to(this.player1.socketId).emit('looser', "one");
            this.gameState.status = GameStatus.finishedGame;
            this.gameState.player2Winner = true;
            this.gameState.player1Looser = true;
            //AXIOS requetes gagnant player 2
        }
    }

    resetBall(direction: number) {
        this.gameState.ball.x = this.gameState.boardWidth / 2 - this.gameState.ball.width / 2; // Replace la balle au centre horizontalement
        this.gameState.ball.y = this.gameState.boardHeight / 2 - this.gameState.ball.height / 2;
        this.gameState.ball.width = this.gameState.ballWidth;
        this.gameState.ball.height = this.gameState.ballHeight; // Replace la balle au centre verticalement
        this.gameState.ball.velocityX = direction;
        this.gameState.ball.velocityY = 2;
        this.gameState.ball.color = "red";
        console.log("----------------------------");
        console.log("Reset de la balle dans : ", this.gameId);
        console.log("----------------------------");
    }

    handleCollisionWithLeftBorder() {
        this.gameState.player2Score += 1;
        this.maxScore();
        this.server.emit('updateScoreP2', this.gameState.player2Score);
    }

    handleCollisionWithRightBorder() {
        this.gameState.player1Score += 1;
        this.maxScore();
        this.server.emit('updateScoreP1', this.gameState.player1Score);
    }

    ScoreAndResetBall(direction: number) {
        if (this.gameState.ball.x < 0) {
            console.log("");
            console.log("point pour 2 in : ", this.gameId);
            this.handleCollisionWithLeftBorder();
            this.resetBall(1);
        }
        else if (this.gameState.ball.x + this.gameState.ballWidth > this.gameState.boardWidth) {
            console.log("");
            console.log("point pour 1 in : ", this.gameId);
            this.handleCollisionWithRightBorder();
            this.resetBall(-1);
        }
    }

    detectingCollisionWithPaddle() {
        if (this.detect(this.gameState.ball, this.gameState.paddle1)) {
            if (this.gameState.ball.y <= this.gameState.paddle1.y + this.gameState.paddle1.height &&
                this.gameState.ball.y + this.gameState.ball.height >= this.gameState.paddle1.y) {

                const paddleCenter = this.gameState.paddle1.y + this.gameState.paddle1.height / 2;
                const ballCenter = this.gameState.ball.y + this.gameState.ball.height / 2;
                const relativeIntersection = ballCenter - paddleCenter;
                const normalizedRelativeIntersection = relativeIntersection / (this.gameState.paddle1.height / 2);
                const bounceAngle = normalizedRelativeIntersection * (Math.PI / 4); // Ajustez l'angle selon vos besoins
                this.gameState.ball.velocityX = Math.cos(bounceAngle) * this.gameState.ball.speed;
                this.gameState.ball.velocityY = Math.sin(bounceAngle) * this.gameState.ball.speed;
            } else if (this.gameState.ball.x <= this.gameState.paddle1.x + this.gameState.paddle1.width) {
                console.log("");
                console.log("ball.x:", this.gameState.ball.x, "est inferieur a ", (this.gameState.paddle1.x + this.gameState.paddle1.width), "(", this.gameState.paddle1.x,") + (", this.gameState.paddle1.width, ") in : ", this.gameId);
                console.log("vel avant : ", this.gameState.ball.velocityX);
                this.gameState.ball.velocityX *= -1;
                console.log("DETECT PADDLE 1 for game : ", this.gameId);
                // this.server.emit('detectCollisionW/Paddle', this.gameState.ball.velocityX, this.gameState.ball.velocityY)

            }
        }
        else if (this.detect(this.gameState.ball, this.gameState.paddle2)) {
          if (this.gameState.ball.y <= this.gameState.paddle2.y + this.gameState.paddle2.height &&
            this.gameState.ball.y + this.gameState.ball.height >= this.gameState.paddle2.y) {

                const paddleCenter = this.gameState.paddle2.y + this.gameState.paddle2.height / 2;
                const ballCenter = this.gameState.ball.y + this.gameState.ball.height / 2;
                const relativeIntersection = ballCenter - paddleCenter;
                const normalizedRelativeIntersection = relativeIntersection / (this.gameState.paddle2.height / 2);
                const bounceAngle = normalizedRelativeIntersection * (Math.PI / 4); // Ajustez l'angle selon vos besoins
                this.gameState.ball.velocityX = -Math.cos(bounceAngle) * this.gameState.ball.speed;
                this.gameState.ball.velocityY = Math.sin(bounceAngle) * this.gameState.ball.speed;
            } else if (this.gameState.ball.x + this.gameState.ballWidth >= this.gameState.paddle2.x) {
                console.log("paddle 2.x : ", this.gameState.paddle2.x, " est inferieur a : (ball.x + ball.width)", (this.gameState.ball.x + this.gameState.ball.width), "(", this.gameState.ball.x,") + (", this.gameState.ball.width, ") in : ", this.gameId);
                console.log("vel avant : ", this.gameState.ball.velocityX);
                this.gameState.ball.velocityX *= -1;
                console.log("DETECT PADDLE 2 for game : ", this.gameId);
                // this.server.emit('detectCollisionW/Paddle', this.gameState.ball.velocityX, this.gameState.ball.velocityY)
            }
        }
    }
    
    detect(a: any, b: any) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    // ScoreAndResetBall(direction: number) {
    //     if (this.gameState.ball.x < 0) {
    //         this.gameState.player2Score += 1;
    //         this.maxScore();
    //         this.sendToPlayer('updateScoreP2', this.gameState.player2Score );
    //         this.resetBall(1);
    //     }
    //     else if (this.gameState.ball.x + this.gameState.ballWidth > this.gameState.boardWidth) {
    //         this.gameState.player1Score += 1;
    //         this.maxScore();
    //         this.sendToPlayer('updateScoreP1', this.gameState.player1Score );
    //         this.resetBall(-1);
    //     }
    // }


    // if ( player.pos.x < ball.pos.x + ball.size.x &&
    //     player.pos.x + player.size.x > ball.pos.x &&
    //     player.pos.y < ball.pos.y + ball.size.y &&
    //     player.size.y + player.pos.y > ball.pos.y ) {
    //     ball.vel.x = -ball.vel.x;
    //   }
   
    // detectingCollisionWithPaddle() {
    //     if (this.detect(this.gameState.ball, this.gameState.paddle1)) {
    //         // if (this.gameState.ball.x <= this.gameState.paddle1.x + this.gameState.paddle1.width) {
    //             this.gameState.ball.velocityX *= -1;
    //             this.server.emit('detectCollisionW/Paddle', this.gameState.ball.velocityX, this.gameState.ball.velocityY)
    //         // }
    //     }
    //     else if (this.detect(this.gameState.ball, this.gameState.paddle2)) {
    //         // if (this.gameState.ball.x + this.gameState.ballWidth >= this.gameState.paddle2.x) {
    //             this.gameState.ball.velocityX *= -1;
    //             this.server.emit('detectCollisionW/Paddle', this.gameState.ball.velocityX, this.gameState.ball.velocityY)
    //         // }
    //     }
    // }

    detectingBorder() {//borderCollision evenement
        if (this.gameState.ball.y <= 0 || this.gameState.ball.y + this.gameState.ball.height >= this.gameState.boardHeight) {
            this.gameState.ball.velocityY = -this.gameState.ball.velocityY;
        }
    }
    
    initialisationBall() {
        this.gameState.ball.x += (this.gameState.ball.velocityX);
        this.gameState.ball.y += (this.gameState.ball.velocityY);
        // this.sendToPlayerBall('ballIsMovingX', this.gameState.ball.x, this.gameState.ball.y, this.gameId);
    }
    
    initialisationPaddle1() {
        this.gameState.paddle1.y += this.gameState.paddle1.velocityY;
        this.gameState.paddle1.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle1.height, this.gameState.paddle1.y));
        // this.sendToPlayer('initplayer1', this.gameState.paddle1.y, this.gameId)
    }
    
    initialisationPaddle2() {
        this.gameState.paddle2.y += this.gameState.paddle2.velocityY;
        this.gameState.paddle2.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle2.height, this.gameState.paddle2.y));
        // this.sendToPlayer('initplayer2', this.gameState.paddle2.y, this.gameId)
    }
    
    updateVelPaddle1(tmp: number) {
        this.gameState.paddle1.velocityY = tmp;
    }
    
    updateVelPaddle2(tmp: number) {
        this.gameState.paddle2.velocityY = tmp;
    }
    
    startGameLoop() {
        setInterval(() => {
            if ((this.gameState.status !== GameStatus.finishedGame) 
            && (this.gameState.status !== GameStatus.abortedGame)) {
                this.initialisationBall();
                this.initialisationPaddle1();
                this.initialisationPaddle2();
                this.detectingBorder();
                // this.server.emit('detectBorder', this.gameState.ball.velocityY)
                // let ballHit = false;
                let ballHitPaddle = false;
                this.detectingCollisionWithPaddle();
                this.ScoreAndResetBall(1);
                this.sendToPlayerBall('ballIsMovingX', this.gameState.ball.x, this.gameState.ball.y, this.gameId);
                this.sendToPlayer('initplayer1', this.gameState.paddle1.y, this.gameId)
                this.sendToPlayer('initplayer2', this.gameState.paddle2.y, this.gameId)
                // this.server.emit('initplayer1', this.gameState.paddle1.y)
                // this.server.emit('initplayer2', this.gameState.paddle2.y)
                // this.server.emit('ballIsMovingX', this.gameState.ball.x, this.gameState.ball.y);
            }   
    
        }, 10); // 16 ms (environ 60 FPS)
    }
}




    // detectingCollisionWithPaddle() {
    //     const speed = 2;
    //     if (this.detect(this.gameState.ball, this.gameState.paddle1)) {
    //         const ballCenterY = this.gameState.ball.y + this.gameState.ball.height / 2;
    //         const relativeIntersectionY = ballCenterY - this.gameState.paddle1.y;
    
    //         const normalizedRelativeIntersectionY = (relativeIntersectionY / this.gameState.paddle1.height) * 2 - 1;
    //         const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4); // 45 degrees
    
    //         this.gameState.ball.velocityX = Math.cos(bounceAngle) * speed;
    //         this.gameState.ball.velocityY = Math.sin(bounceAngle) * speed;
    
    //         console.log("COLLISION WITH PADDLE 1");
    //     } else if (this.detect(this.gameState.ball, this.gameState.paddle2)) {
    //         const ballCenterY = this.gameState.ball.y + this.gameState.ball.height / 2;
    //         const relativeIntersectionY = ballCenterY - this.gameState.paddle2.y;
    
    //         const normalizedRelativeIntersectionY = (relativeIntersectionY / this.gameState.paddle2.height) * 2 - 1;
    //         const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4); // 45 degrees
    
    //         this.gameState.ball.velocityX = -Math.cos(bounceAngle) * speed;
    //         this.gameState.ball.velocityY = Math.sin(bounceAngle) * speed;
    
    //         console.log("COLLISION WITH PADDLE 2");
    //     }
    // }