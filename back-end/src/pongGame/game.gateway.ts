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
    
    // private gameState: GameStateBD = new GameStateBD();
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

    getStrGame(id: string)//trouve la id socket du game
    {
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const gameId = currentGame.getGameId();
            const d1 = currentGame.getPlayer1Id();
            const d2 = currentGame.getPlayer2Id();
            if (id === d1 || id === d2) {//la socket recue correspond a un joueur
                return gameId;//alors ce joueur est relie a une gameId, la retourner

            } else {
            }
        }
    }

    getP(id: string)//trouve la id socket des players
    {
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const gameId = currentGame.getGameId();
            const d1 = currentGame.getPlayer1Id();
            const d2 = currentGame.getPlayer2Id();
            if (id === d1) {//la socket recue correspond a un joueur
                return 1;
            } else  if (id === d2) {
                return 2;//ce joueur est enregistre en P1 ou en P2 donc retourner 1 ou 2
            }
        }
    }
  
    getGaObj(id: string)//id de la game
    {
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const gameId = currentGame.getGameId();
            const d1 = currentGame.getPlayer1Id();
            const d2 = currentGame.getPlayer2Id();
            if (id === d1 || id === d2) {//la socket recue correspond a un joueur
                return this.games[i].getGameObject();
            } else {
            }
        }
    }

    getOpponentSocket(mySocket: string) {
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const d1 = currentGame.getPlayer1Id();
            const d2 = currentGame.getPlayer2Id();
            if (mySocket === d1) {//la socket recue correspond a un joueur
                return d2;
            } else if (mySocket === d2) {
                return d1;
            }
        }
    }
    
    // TODO Change for only 1 socket
    @SubscribeMessage('keydown')
    handleKeyPressedUpDown(client: Socket, data: {key: string}) {
        const strGame = this.getStrGame(client.id);
        const playerSample = this.getP(client.id);//attention ne se lance pas si on rafraichit la page
        const gameState = this.getGaObj(client.id);
        if (data.key === "ArrowUp" && playerSample === 1)
            gameState.paddle1.velocityY = -3;
        else if (data.key === "ArrowDown" && playerSample === 1)
            gameState.paddle1.velocityY = 3;
        else if (data.key === "ArrowUp" && playerSample === 2)
            gameState.paddle2.velocityY = -3;
        else if (data.key === "ArrowDown" && playerSample === 2)
            gameState.paddle2.velocityY = 3;
        if (playerSample === 1)//JOUEUR DU PADDLE 1 ARROW UP ET DOWN
        {
            gameState.paddle1.socket = client.id;//met la socket du joueur dans son paddle
            gameState.paddle1.y += gameState.paddle1.velocityY;
            gameState.paddle1.y = Math.max(0, Math.min(gameState.boardHeight - gameState.paddle1.height, gameState.paddle1.y));
            const oppoSock = this.getOpponentSocket(client.id);
            this.server.to(oppoSock).emit('initplayer1', gameState.paddle1.y, 
                gameState.paddle1.socket);
            this.server.to(client.id).emit('initplayer1', gameState.paddle1.y, 
                gameState.paddle1.socket);
        }
        else if (playerSample === 2)//JOUEUR DU PADDLE 2 ARROW UP ET DOWN
        {
            gameState.paddle2.socket = client.id;//met la socket du joueur dans son paddle
            gameState.paddle2.y += gameState.paddle2.velocityY;
            gameState.paddle2.y = Math.max(0, Math.min(gameState.boardHeight - gameState.paddle2.height, gameState.paddle2.y));
            const oppoSock = this.getOpponentSocket(client.id);
            this.server.to(oppoSock).emit('initplayer2', gameState.paddle2.y, 
                gameState.paddle2.socket);
            this.server.to(client.id).emit('initplayer2', gameState.paddle2.y, 
                gameState.paddle2.socket);
        }
        else
            return ;
    }



    // TODO Change for game Class
    @SubscribeMessage('handleCollision2')
    handleCollisionWithLeftBorder() {
        // this.games.maxScore();
        // this.server.emit('updatePlayer2', gameState.player2Score );
    }

    @SubscribeMessage('handleCollision1')
    handleCollisionWithRightBorder() {
        // this.games.maxScore();
        // this.server.emit('updatePlayer1', gameState.player1Score );
    }

    // TODO Move to gameClass
   
    
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
            // console.log("LES JOUEURS QUI VEULENT JOUER SONT : 1  ", player1);
            // console.log("LES JOUEURS QUI VEULENT JOUER SONT : 2  ", player2);
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