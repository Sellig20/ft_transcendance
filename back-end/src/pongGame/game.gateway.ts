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

export class gatewayPong implements OnGatewayDisconnect<Socket> {
    
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
    }
    
    handleDisconnect(client: Socket, ...args: any[]) {
        // this.removeUser(client.id);
        this.server.emit('user-disconnected', { clientId: client.id, userArray: this.userArray});
    }

    getStrGame(id: string)
    {
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const gameId = currentGame.getGameId();
            const d1 = currentGame.getPlayer1Id();
            const d2 = currentGame.getPlayer2Id();
            if (id === d1 || id === d2) {
                console.log(`Game found for player ${id}: ${gameId}`);
                // Faites ce que vous devez faire avec la game trouvée
            } else {
                console.log(`No game found for player ${id} in game ${gameId}`);
            }
        }
    }
    
    // TODO Change for only 1 socket
    @SubscribeMessage('keydownPD1')
    handleKeyPressedDownPD1(client: Socket, data: {key: string}) {
        console.log('PADDLE MOVED: [', data.key, '] by', client.id);        // this.handleUpdatePositionPaddle(client, data);
        const strGame = this.getStrGame(client.id);
        this.gameState.paddle1.velocityY = 3;
        this.handleInitialisationPlayer1();
        this.server.emit('paddle1Moved', this.gameState.paddle1.velocityY);
    }

    @SubscribeMessage('keyupPD1')
    handleKeyPressedUpPD1(client: Socket, data: {key: string}) {
        console.log('PADDLE MOVED: [', data.key, '] by', client.id);        
        const strGame = this.getStrGame(client.id);
        this.gameState.paddle1.velocityY = -3;
        this.handleInitialisationPlayer1();
        this.server.emit('paddle1Moved', this.gameState.paddle1.velocityY);
    }

    // @SubscribeMessage('keyupPD2')
    // handleKeyPressedUpPD2(client: Socket, data: { key: string }) {
    //     console.log('PADDLE MOVED: [', data.key, '] by', client.id);
    //     this.gameState.paddle2.velocityY = -3;
    //     this.handleInitialisationPlayer2();
    //     this.server.emit('paddle2Moved', this.gameState.paddle1.velocityY);
    // }

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


    @SubscribeMessage('goQueueList') 
    handleGoQueueList(client: Socket, socketId: string): void {
        for (let i = 0; i < this.userArray.length; i++) {
            const player = this.userArray[i];
            if (socketId === player.socketId && player.status) {//si tu as clique
                player.status = playerStatus.isAvailable;//je te mets en available pour jouer
                player.socketId = socketId;
                this.userArray.splice(i, 1, player);//je remets le joueur actualise
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
            console.log("");
            console.log("");
            console.log("LES JOUEURS QUI VEULENT JOUER SONT : 1  ", player1);
            console.log("LES JOUEURS QUI VEULENT JOUER SONT : 2  ", player2);
            console.log("");
            console.log("");
            const currentGame = new Game(gameId, this.server, player1, player2);
            this.games.push(currentGame);
            currentGame.actualDataInClassGame();
            currentGame.start();
            playersAvailable.length = 0;
            this.removeUser(player1.socketId);
            this.removeUser(player2.socketId);
    
            // Retirer les joueurs de playersAvailable
            const indexPlayer1 = playersAvailable.findIndex(player => player.socketId === player1.socketId);
            const indexPlayer2 = playersAvailable.findIndex(player => player.socketId === player2.socketId);
    
            if (indexPlayer1 !== -1) {
                playersAvailable.splice(indexPlayer1, 1);
            }
    
            if (indexPlayer2 !== -1) {
                playersAvailable.splice(indexPlayer2, 1);
            }
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