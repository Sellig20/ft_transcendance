import  { Server, Socket } from 'socket.io';
import { GameStateBD, Player, GameStatus} from "./gameStateBD";
import { GameService } from './game.service';
import { GameOverDTO } from './dto';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';

export class Game {
    
    private gameState: GameStateBD;
    private gameId: string;
    private server: Server;
    private player1: Player;
    private player2: Player;
    private mapChoice: number;
    private gs: GameService;
    private us: UsersService;
   
    private initializeGameState(): GameStateBD {
      const gameState = new GameStateBD();
      gameState.paddle1.socket = this.player1.socketId;
      gameState.paddle2.socket = this.player2.socketId;
      gameState.status = GameStatus.playingGame;
      return gameState;
    }

    constructor(Id: string, server: Server, player1: Player, player2: Player, mapChoice: number, gs: GameService, us: UsersService) {
        this.player1 = player1;
        this.player2 = player2;
        this.server = server;
        this.gameId = Id;
        this.gameState = this.initializeGameState();
        this.mapChoice = mapChoice;
        this.gs = gs;
        this.us = us;
    }

    actualDataInClassGame() {
        console.log("game id => ", this.gameId);
        
    }

    async start() {
        //STATUS GAME BEGINS
        this.sendToPlayer("prepareForMatch", {}, "jojo");
        this.gameState.status = GameStatus.playingGame;
        await this.us.changeStatus(this.player1.userid, "in game");
        await this.us.changeStatus(this.player2.userid, "in game");
        this.startGameLoop();
    }

    async statusAbandon(socketClient: string) {
        this.gameState.status = GameStatus.abortedGame;
        await this.us.changeStatus(this.player1.userid, "online");
        await this.us.changeStatus(this.player2.userid, "online");
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
    }//a commenter pour tej les fakes data
	// async onModuleInit() {
	// 	const fakeusers = await this.prisma.user.findMany({})
	// 	if (fakeusers.length < 12)
	// 		await this.generateAndSaveFakeData();
	// }

	// async generateAndSaveFakeData() {

	// 	const fakeMatch = Array.from({ length: 25 }, () => ({
	// 		winnerId: Math.floor(Math.random() * 21),
	// 		loserId: Math.floor(Math.random() * 21),
	// 		loserElo: 400,
	// 		winnerElo: 400
	// 	}));

	// 	const fakeUsers = Array.from({ length: 10 }, () => ({
	// 		email: faker.internet.email(),
	// 		username: faker.internet.userName(),
	// 		win: Math.floor(Math.random() * 10),
	// 		lose: Math.floor(Math.random() * 10)
	// 	}));

	// 	for (const user of fakeUsers) {
	// 		await this.prisma.user.create({ data: user });
	// 	}

	// 	for (const match of fakeMatch) {
	// 		await this.prisma.match.create({ data: match });
	// 	}
	// }

    setCrash(socketClient: string) {
        this.gameState.status = GameStatus.abortedGame;
    }

    setFinito() {
        // console.log("---- je suis setFinito de game.class");
        this.gameState.status = GameStatus.finishedGame;
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

    getPlayer1UserID() : number {
        return this.player1.userid;
    }

    getPlayer2UserID() : number {
        return this.player2.userid;
    }

    getSocketByUserID(userId: number) : string {
        if (userId === this.player1.userid)
            return this.player1.socketId;
        else if (userId === this.player2.userid)
            return this.player2.socketId;
    }

    async maxScore() {
        if (this.gameState.player1Score === 11) {
            this.server.to(this.player1.socketId).emit('winner', "one");
            this.server.to(this.player2.socketId).emit('looser', "two");
            this.gameState.status = GameStatus.finishedGame;
            console.log("userid 1 winner => ", this.player1.userid);
            console.log("userid 2 looser => ", this.player2.userid);
            const data = new GameOverDTO();
            data.winnerId = this.player1.userid;
            data.loserId = this.player2.userid;
            await this.gs.saveMatchs(data);
            await this.us.changeStatus(this.player1.userid ,"online");
            await this.us.changeStatus(this.player2.userid ,"online");
            this.gameState.player1Winner = true;
            this.gameState.player2Looser = true;
        }
        else if (this.gameState.player2Score === 11) {
            this.server.to(this.player2.socketId).emit('winner', "two");
            this.server.to(this.player1.socketId).emit('looser', "one");
            this.gameState.status = GameStatus.finishedGame;
            console.log("userid 1 looser => ", this.player1.userid);
            console.log("userid 2 winner => ", this.player2.userid);
            const data = new GameOverDTO();
            data.winnerId = this.player2.userid;
            data.loserId = this.player1.userid;
            await this.us.changeStatus(this.player1.userid ,"online");
            await this.us.changeStatus(this.player2.userid ,"online");
            await this.gs.saveMatchs(data)
            this.gameState.player2Winner = true;
            this.gameState.player1Looser = true;

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
    }

    async ScoreAndResetBall(direction: number) {
        if (this.gameState.ball.x < 0) {
            this.gameState.player2Score += 1;
            await this.maxScore();
            this.sendToPlayer('updateScoreP2', this.gameState.player2Score, this.gameId);
            this.resetBall(1);
        }
        else if (this.gameState.ball.x + this.gameState.ballWidth > this.gameState.boardWidth) {
            this.gameState.player1Score += 1;
            await this.maxScore();
            this.sendToPlayer('updateScoreP1', this.gameState.player1Score, this.gameId);
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
                this.gameState.ball.velocityX *= -1;

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
                this.gameState.ball.velocityX *= -1;
            }
        }
    }
    
    detect(a: any, b: any) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    detectingBorder() {//borderCollision evenement
        if (this.gameState.ball.y <= 0 || this.gameState.ball.y + this.gameState.ball.height >= this.gameState.boardHeight)
            this.gameState.ball.velocityY = -this.gameState.ball.velocityY;
    }

    initChoiceMap() {
        this.sendToPlayer('choiceMap', this.mapChoice, this.gameId);
    }

    initialisationBall() {
        this.gameState.ball.x += (this.gameState.ball.velocityX * this.gameState.currentLevel);
        this.gameState.ball.y += (this.gameState.ball.velocityY * this.gameState.currentLevel);
        this.sendToPlayerBall('ballIsMovingX', this.gameState.ball.x, this.gameState.ball.y, this.gameId);
    }

    initialisationPaddle1() {
        this.gameState.paddle1.y += this.gameState.paddle1.velocityY;
        this.gameState.paddle1.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle1.height, this.gameState.paddle1.y));
        this.sendToPlayer('initplayer1', this.gameState.paddle1.y, this.player1.socketId)
    }

    initialisationPaddle2() {
        this.gameState.paddle2.y += this.gameState.paddle2.velocityY;
        this.gameState.paddle2.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle2.height, this.gameState.paddle2.y));
        this.sendToPlayer('initplayer2', this.gameState.paddle2.y, this.player2.socketId)
    }

    updateVelPaddle1(tmp: number) {
        this.gameState.paddle1.velocityY = tmp;
    }
                
    updateVelPaddle2(tmp: number) {
        this.gameState.paddle2.velocityY = tmp;
    }

    checkLevelChangeVelocity() {
        let flag1: boolean = false;
        let flag2: boolean = false;
        let flag8: boolean = false;
        if (this.gameState.player1Score === 4 || this.gameState.player1Score === 8) {
            flag1 = true;
            if (this.gameState.player1Score === 8)
                flag8 = true;
        }
        if (this.gameState.player2Score === 4 || this.gameState.player2Score === 8) {
            flag2 = true;
            if (this.gameState.player1Score === 8)
                flag8 = true;
        }
        else {
            flag1 = false;
            flag2 = false;
        }
        if (flag8 === false && flag1 && flag2) {
            this.gameState.currentLevel = 1.5;
            this.gameState.playerVelocityY = 1.4;
        }
        else if (flag8 && flag1 && flag2) {
            this.gameState.currentLevel = 1.9;
            this.gameState.playerVelocityY = 1.8;
        }
    }

    checkGameStatus(): boolean {
    if (this.gameState.status === GameStatus.abortedGame || 
        this.gameState.status === GameStatus.finishedGame)
        {
            console.log("GAME IS OVER");
            this.sendToPlayer('gameIsOver', 1, this.gameId);
            return true;
        }
        else
            return false;
    }

    startGameLoop() {
        const loop = setInterval(async () => {
            console.log("game status loop game.class : ", this.gameState.status);
            if ((this.gameState.status !== GameStatus.finishedGame) 
            && (this.gameState.status !== GameStatus.abortedGame)) {
                this.initChoiceMap();
                this.initialisationBall();
                if (this.mapChoice === 2)
                {
                    this.checkLevelChangeVelocity();
                }
                this.initialisationPaddle1();
                this.initialisationPaddle2();
                this.detectingBorder();
                this.detectingCollisionWithPaddle();
                await this.ScoreAndResetBall(1);
                // if (this.checkGameStatus() === true)
                    // break;
            }
            else
                clearInterval(loop);
        }, 10); // 16 ms (environ 60 FPS)
    }

    removeGameById = (idToRemove: string) => {
        this.gameId = null;
    };
}
