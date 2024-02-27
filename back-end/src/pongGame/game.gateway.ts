import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameStateBD } from "./gameStateBD";
import { Player } from "./gameStateBD";
import { Game } from "./game.class";
import { playerStatus, GameStatus } from "./gameStateBD";
import { v4 as uuidv4 } from 'uuid';
import { OnModuleInit } from "@nestjs/common";

@WebSocketGateway(8002, {
    // namespace: 'game',
    cors: "*"
})

export class gatewayPong implements OnModuleInit, OnGatewayConnection,OnGatewayDisconnect<Socket> {
    @WebSocketServer()
    server: Server;
    
    private userArray: Player[] = [];
    games: Game[] = [];

    constructor() {}

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection : ', (socket) => {
            console.log('Connection -> ', socket.id);
        })
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`[GAME] Client connected: ${client.id}`);
        this.addUser(client.id);
    }
    
    handleDisconnect(client: Socket, ...args: any[]) {
        this.removeUser(client.id);
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
    
    @SubscribeMessage('FIRST')
    async handleMessageconnection(client: any, message: any) {
        console.log("FIRST ouistiti", message.userid, client.id)
    }

    @SubscribeMessage('keydown')
    handleKeyPressedUpDown(client: Socket, data: {key: string}) {
        const playerSample = this.getP(client.id);//attention ne se lance pas si on rafraichit la page
        let tmp: number = 0;
        if (data.key === "ArrowUp" && playerSample === 1)
            tmp = -3;
        else if (data.key === "ArrowDown" && playerSample === 1)
            tmp = 3;
        else if (data.key === "ArrowUp" && playerSample === 2)
            tmp = -3;
        else if (data.key === "ArrowDown" && playerSample === 2)
            tmp = 3;
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const gameId = currentGame.getGameId();
            const d1 = currentGame.getPlayer1Id();
            const d2 = currentGame.getPlayer2Id();
            if (client.id === d1 || client.id === d2) {//la socket recue correspond a un joueur
                if (playerSample === 1)//JOUEUR DU PADDLE 1 ARROW UP ET DOWN
                {
                    this.games[i].updateVelPaddle1(tmp);
                }
                else if (playerSample === 2)//JOUEUR DU PADDLE 2 ARROW UP ET DOWN
                {
                    this.games[i].updateVelPaddle2(tmp);
                }
                else
                    return ;
            }
        }
    }

    @SubscribeMessage('Abandon')
    handleAbandon(client: Socket, socketId: string): void {
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const d1 = currentGame.getPlayer1Id();
            const d2 = currentGame.getPlayer2Id();
            if (socketId === d1 || socketId === d2) {//la socket recue correspond a un joueur
                currentGame.statusAbandon(socketId);
            }
        }
    }

    @SubscribeMessage('goQueueList') 
    handleGoQueueList(client: Socket, data: {socketId: string, mapChoice: number}): void {
        console.log("map choice = ", data.mapChoice);
        console.log("socket id => ", data.socketId);
        for (let i = 0; i < this.userArray.length; i++) {
            const player = this.userArray[i];
            if (data.socketId === player.socketId && player.status) {//si tu as clique
                player.status = playerStatus.isAvailable;//je te mets en available pour jouer
                player.socketId = data.socketId;
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
            let player1: any = null;
            let player2: any = null;
            player1 = playersAvailable[0];
            player2 = playersAvailable[1];
            const gameId = uuidv4();
            const currentGame = new Game(gameId, this.server, player1, player2);
            console.log("");
            console.log("Joueur 1 : ", player1.socketId);
            console.log("Joueur 2 : ", player2.socketId);
            console.log("Game id : ", gameId);
            console.log("");
            this.games.push(currentGame);
            currentGame.actualDataInClassGame();
            currentGame.start();
            playersAvailable.length = 0;
            this.removeUser(player1.socketId);
            this.removeUser(player2.socketId);
    
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
            level: 0,
        };
        this.userArray.push(newPlayer);
    }
    
    private removeUser(userId: string): void {
        const indexToRemove = this.userArray.findIndex(player => player.socketId === userId);
        if (indexToRemove !== -1) {
            this.userArray.splice(indexToRemove, 1);
        }
    }
}