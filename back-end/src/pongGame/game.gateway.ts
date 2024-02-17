import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameStateBD } from "./gameStateBD";
import { Player } from "./gameStateBD";
import { Game } from "./game.class";
import { playerStatus } from "./gameStateBD";
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway(8001, {
    // namespace: 'game',
    cors: "*"
})

export class gatewayPong implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
    
    @WebSocketServer()
    server: Server;
    
    private gameState: GameStateBD = new GameStateBD();
    private userArray: Player[] = [];// BUG CHANGE THIS
    games: Game[] = [];

    constructor() {}

    // onModuleInit() {
    //     this.server.on('-- ON MODULE INIT -- connection : ', (socket) => {
    //         console.log('Connection -> ', socket.id);
    //     })
    // }

    handleConnection(client: Socket, ...args: any[]) {
        let i = 0;
        this.addUser(client.id);
        // console.log("--------------------- on connection 1 ------------------");
        // this.displayUserArray();
        // console.log("--------------------- on connection 2 ------------------");

    }
    // this.server.to(client.id).emit('yourUserId', userIndex + 1);

    // this.server.emit('user-connected', { clientId: client.id, userArray: this.userArray});
    
    handleDisconnect(client: Socket, ...args: any[]) {
        this.removeUser(client.id);
        this.server.emit('user-disconnected', { clientId: client.id, userArray: this.userArray});
    }

    // TODO Change for only 1 socket
    @SubscribeMessage('keydownPD1')
    handleKeyPressedDownPD1(client: Socket, data: { key: string }) {
        console.log('PADDLE MOVED: [', data.key, '] by', client.id);        // this.handleUpdatePositionPaddle(client, data);
        this.gameState.paddle1.velocityY = 3;
        this.handleInitialisationPlayer1();
        this.server.emit('paddle1Moved', this.gameState.paddle1.velocityY);
    }

    @SubscribeMessage('keydownPD2')
    handleKeyPressedDownPD2(client: Socket, data: { key: string }) {
        console.log('PADDLE MOVED: [', data.key, '] by', client.id);        // this.handleUpdatePositionPaddle(client, data);
        this.gameState.paddle2.velocityY = 3;
        this.handleInitialisationPlayer2();
        this.server.emit('paddle2Moved', this.gameState.paddle1.velocityY);
    }

    @SubscribeMessage('keyupPD1')
    handleKeyPressedUpPD1(client: Socket, data: { key: string }) {
        console.log('PADDLE MOVED: [', data.key, '] by', client.id);
        this.gameState.paddle1.velocityY = -3;
        this.handleInitialisationPlayer1();
        this.server.emit('paddle1Moved', this.gameState.paddle1.velocityY);
    }

    @SubscribeMessage('keyupPD2')
    handleKeyPressedUpPD2(client: Socket, data: { key: string }) {
        console.log('PADDLE MOVED: [', data.key, '] by', client.id);
        this.gameState.paddle2.velocityY = -3;
        this.handleInitialisationPlayer2();
        this.server.emit('paddle2Moved', this.gameState.paddle1.velocityY);
    }

    // TODO Change for game Class
    @SubscribeMessage('handleCollision2')
    handleCollisionWithLeftBorder() {
        this.gameState.player2Score += 1;
        // this.games.maxScore();
        // console.log("player 2 score =>", this.gameState.player2Score)
        this.server.emit('updatePlayer2', this.gameState.player2Score );
    }

    @SubscribeMessage('handleCollision1')
    handleCollisionWithRightBorder() {
        this.gameState.player1Score += 1;
        // this.games.maxScore();
        // console.log("player 1 score =>", this.gameState.player1Score)
        this.server.emit('updatePlayer1', this.gameState.player1Score );
    }

    // TODO Move to gameClass
    @SubscribeMessage('handleInit1')
    handleInitialisationPlayer1() {
        this.gameState.paddle1.y += this.gameState.paddle1.velocityY;
        this.gameState.paddle1.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle1.height, this.gameState.paddle1.y));
        this.server.emit('initplayer1', this.gameState.paddle1.y)
    }

    @SubscribeMessage('handleInit2')
    handleInitialisationPlayer2() {
        this.gameState.paddle2.y += this.gameState.paddle2.velocityY;
        this.gameState.paddle2.y = Math.max(0, Math.min(this.gameState.boardHeight - this.gameState.paddle2.height, this.gameState.paddle2.y));
        this.server.emit('initplayer2', this.gameState.paddle2.y)
    }
    
    @SubscribeMessage('handleInitBallAndGame')
    handleInitialisationBall() {
        // this.games.startGameLoop();
    }

    // @SubscribeMessage('goQueueList')
    // handleGoQueueList(client: Socket, payload: any): void {
    //   const playersToPlay = this.players.filter(player => player.status === PlayerStatus.Available).slice(0, 2);
  
    //   if (playersToPlay.length === 2) {
    //     playersToPlay.forEach(player => {
    //       player.status = PlayerStatus.Playing;
    //     });
  
    //     playersToPlay.forEach(player => {
    //       this.server.to(player.id).emit('gameStart', { message: 'Le jeu commence!' });
    //     });
    //   } else {

    //   }
    // }
  
    // private emitUpdatedPlayers() {
    //   this.server.emit('updatedPlayers', this.players);
    // }

    @SubscribeMessage('goQueueList') 
    handleGoQueueList(client: Socket, socketId: string): void {
        for (let i = 0; i < this.userArray.length; i++) {
            const player = this.userArray[i];
            if (socketId === player.socketId) {
                player.status = playerStatus.isAvailable;
                player.socketId = socketId;
                this.userArray.splice(i, 1, player);
            }
        }
        const playersAvailable = this.userArray.filter(player => player.status === playerStatus.isAvailable);
        this.toPlay(playersAvailable);
    }
    
    toPlay(playersAvailable: Player[])
    {
        if (playersAvailable.length == 2)
        {
            const player1 = playersAvailable[0];
            const player2 = playersAvailable[1];
            const gameId = uuidv4();
            const currentGame = new Game(gameId, this.server, player1, player2);
            this.games.push(currentGame);
            currentGame.actualDataInClassGame();
            currentGame.start();
            this.removeUser(player1.socketId);
            this.removeUser(player2.socketId);
        }
    }

    private displayUserArray(): void {
        console.log("-------------------------------");
        this.userArray.forEach((player: Player) => {
            console.log(`Player ID: ${player.socketId}, Status: ${player.status}`);
        });
        console.log("-------------------------------");
    }
    
    private addUser(item: string): void {
        const newPlayer: Player = {
            socketId: item,
            status: playerStatus.isSettling,
        };
        this.userArray.push(newPlayer);
        // const index = this.userArray.indexOf(item);
        // console.log(`Le client ajoute est => ${item} pour index : ${index}`);
    }
    
    private removeUser(userId: string): void {
        const indexToRemove = this.userArray.findIndex(player => player.socketId === userId);
        if (indexToRemove !== -1) {
            this.userArray.splice(indexToRemove, 1);
        }
    }
}



// let count = 0;
        // this.displayUserArray();
        // for (let i = 0; i < this.userArray.length; i++) {
        //     const player = this.userArray[i];
        //     const sI = player.socketId;
        //     if (player.status === 'IS AVAILABLE') {
        //         if (count === 1) {
        //             player.status = playerStatus.isPlaying;
        //             player.socketId = sI;
        //             this.userArray.splice(i, 1, player);
        //             break;
        //         }
        //         else {
        //             count = 1;
        //             player.status = playerStatus.isWaitingSmo;
        //             player.socketId = sI;
        //             this.userArray.splice(i, 1, player);
        //         }
        //     }
        // }
        // if (count === 1) {
        //     for (let i = 0; i < this.userArray.length; i++) {
        //         const player = this.userArray[i];
        //         const sI = player.socketId;
        //         if (player.status === 'IS WAITING SOMEONE') {
        //                 player.status = playerStatus.isPlaying;
        //                 player.socketId = sI;
        //                 this.userArray.splice(i, 1, player);
        //         }
        //     }
        // }