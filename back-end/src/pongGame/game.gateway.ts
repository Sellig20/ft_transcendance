import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameStateBD } from "./gameStateBD";
import { Player } from "./gameStateBD";
import { Game } from "./game.class";
import { playerStatus, GameStatus } from "./gameStateBD";
import { v4 as uuidv4 } from 'uuid';
import { OnModuleInit } from "@nestjs/common";
import { GameService } from "./game.service";
import { UsersService } from "src/user/user.service";

@WebSocketGateway(8002, {
	cors: "*"
})

export class gatewayPong implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect<Socket> {
	@WebSocketServer()
	server: Server;

	private userArray: Player[] = [];
    private playersAvailable: Player[] = [];
	games: Game[] = [];

    constructor(
        private gs: GameService,
        private us: UsersService
    ) {}

	onModuleInit() {
		this.server.on('-- ON MODULE INIT -- connection : ', (socket) => {
			console.log('Connection -> ', socket.id);
		})
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`[GAME] Client connected: ${client.id}`);
		this.server.to(client.id).emit("FIRST", { msg: "who are you" })

    }
    
    async handleDisconnect(client: Socket, ...args: any[]) {//ceui qui a teg--");
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const uidP1 = currentGame.getPlayer1UserID();
            const uidP2 = currentGame.getPlayer2UserID();
            this.us.changeStatus(uidP1 ,"online");
            this.us.changeStatus(uidP2 ,"online");
            let sock1 = this.returnNewSocket(uidP1);
            let sock2 = this.returnNewSocket(uidP2);
            if (sock1 !== "undefined" && client.id === sock2) {
                currentGame.setFinito();
                this.server.to(sock1).emit('oppo-crashed-j1', sock1);
                if (!(await this.us.checkStatus(uidP1) === "offline")) {      
                    this.us.changeStatus(uidP1 ,"online");
                }
            }
            else if (sock2 !== "undefined" && client.id === sock1) {
                currentGame.setFinito();
                this.server.to(sock2).emit('oppo-crashed-j2', sock2);
                if (!(await this.us.checkStatus(uidP2) === "offline")) {      
                    this.us.changeStatus(uidP2 ,"online");
                }
            }
        }
        this.removeUser(client.id);
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
			} else if (id === d2) {
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

	@SubscribeMessage('FIRST')
	async handleMessageconnection(client: any, message: any) {
		console.log("[FIRST]", client.id, "= client:", message.userid)
		this.addUser(client.id, -1, message.userid, -1);
		this.server.to(client.id).emit("firstFinish", {msg:"vasy"})
    }

    @SubscribeMessage('refreshInQueue')
    handleRefreshInQueue(client: Socket) {
        for (let i = 0; i < this.playersAvailable.length; i++) {
            if (client.id === this.playersAvailable[i].socketId)
            {
                const mapChoiceEmmerdeur = this.playersAvailable[i].map;
                const userIdEmmerdeur = this.playersAvailable[i].userid;
                console.log("ouiouioui");
                this.playersAvailable.splice(i, 1);
                break;
            }
        }
        for (let i = 0; i < this.userArray.length; i++) {
            if (client.id === this.userArray[i].socketId)
            {
                this.userArray.splice(i, 1);
                break;
            }
        }
    }

	@SubscribeMessage('keydown')
	handleKeyPressedUpDown(client: Socket, data: { key: string }) {
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
					return;
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

    @SubscribeMessage('IsFinished')
    handleIsFinished(client: Socket, socketId: string) {
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const d1 = currentGame.getPlayer1Id();
            const d2 = currentGame.getPlayer2Id();
            if (socketId === d1 || socketId === d2) {//la socket recue correspond a un joueur
                this.removeUser(socketId);
            }
        }
    }

    @SubscribeMessage('Crash')
    handleCrash(client: Socket, socketId: string): void {
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const d1 = currentGame.getPlayer1Id();
            const d2 = currentGame.getPlayer2Id();
            if (socketId === d1 || socketId === d2) {//la socket recue correspond a un joueur
                currentGame.setCrash(socketId);
            }
        }
    }

    UpdatePlayer(socket: string, userid: number) {
        for (let i = 0; i < this.userArray.length; i++) {
            if (this.userArray[i].userid === userid)
            {
                if (this.userArray[i].socketId !== socket) {
                    this.userArray[i].socketId = socket;
                }
            }
        }
    }

    UpdatePlayerReturn(socket: string, userid: number): string {
        for (let i = 0; i < this.userArray.length; i++) {
            if (this.userArray[i].userid === userid)
            {
                if (this.userArray[i].socketId !== socket) {
                    this.userArray[i].socketId = socket;
                    return this.userArray[i].socketId;
                }
            }
        }
    }

    @SubscribeMessage('to-remove-now')
    async handleRemoveNow(client: Socket) {
        this.removeUser(client.id);
    }

    @SubscribeMessage('finito')//ceui qui sest fait quitter
    async handleFinito(client: Socket, userid: number) {
        for (let i = 0; i < this.games.length; i++) {
            const currentGame = this.games[i];
            const j1 = currentGame.getPlayer1UserID();
            const j2 = currentGame.getPlayer2UserID();
            this.us.changeStatus(j2 ,"online");
            this.us.changeStatus(j1 ,"online");
            let s1 = this.returnNewSocket(j1);
            let s2 = this.returnNewSocket(j2);
            if (s1 !== "undefined" && s2 === client.id) {
                currentGame.setFinito();
                console.log("------1--------");
                this.server.to(s1).emit('user-disconnected-j1', s1, j1);
                if (!(await this.us.checkStatus(j1) === "offline")) {      
                    this.us.changeStatus(j1 ,"online");
                }
            }
            else if (s2 !== "undefined" && s2 === client.id) {
                currentGame.setFinito();
                console.log("------2--------");

                this.server.to(s2).emit('user-disconnected-j2', s2, j2);
                if (!(await this.us.checkStatus(j2) === "offline")) {      
                    this.us.changeStatus(j2 ,"online");
                }
            }
        }
        this.removeUser(client.id);
    }

	@SubscribeMessage('quitQueue')
	handleQuitQueue(client: Socket) {
		this.removeUser(client.id);
	}

    @SubscribeMessage('goQueueList')//evenement de websocketQG
    handleGoQueueList(client: Socket, data: {socketId: string, mapChoice: number, userId: number}): void {
        this.addUser(client.id, data.mapChoice, data.userId, -1);//add user dans le userArray
        for (let i = 0; i < this.userArray.length; i++) {
            const player = this.userArray[i];//je regarde chaque user added
            
            if (data.userId === player.userid && player.status) {//si tu as clique
                player.status = playerStatus.isAvailable;//je te mets en available pour jouer
                player.socketId = data.socketId;
                this.userArray.splice(i, 1, player);//je remets le joueur actualise
            }
        }
        this.playersAvailable = this.userArray.filter(player => player.status === playerStatus.isAvailable && player.user2 === -1);
        this.toPlay(this.playersAvailable, data.mapChoice);//j'ai pris deux joueurs available direction juste en dessous
    }

    @SubscribeMessage('goQueueListPrivate')//evenement de websocketQG
    handleGoQueueListPrivate(client: Socket, data: {socketId: string, mapChoice: number, userId: number, user2: number}): void {
        let mapChoice = 1
		this.addUser(client.id, 1, data.userId, data.user2);//add user dans le userArray
		let playersAvailablePrivate = []
        for (let i = 0; i < this.userArray.length; i++) {
            const player = this.userArray[i];//je regarde chaque user added
            
            if (data.userId === player.userid) {//si tu as clique
                player.status = playerStatus.isAvailable;//je te mets en available pour jouer
                this.userArray.splice(i, 1, player);//je remets le joueur actualise
				playersAvailablePrivate.push(player)
            }
        }
		// recherche si ton pote t'attend
		for (let i = 0; i < this.userArray.length; i++) {
            if (this.userArray[i].user2 === data.userId)
				playersAvailablePrivate.push(this.userArray[i])
        }
		if (playersAvailablePrivate.length === 2)
			this.toPlay(playersAvailablePrivate, mapChoice);//j'ai pris deux joueurs available direction juste en dessous
		else
		{
			console.log("user", data.userId, "attend son pote pour jouer...")
		}
    }
    
    async toPlay(playersAvailable: Player[], mapChoice: number)
    {
        if (playersAvailable.length == 2)//si ils sont 2
        {
            let player1: Player = null;
            let player2: Player = null;
            player1 = playersAvailable[0];
            player2 = playersAvailable[1];//je les attrape
            if (player1.map === player2.map && player1.userid != player2.userid) {//si ils ont le MEME choix de map
                const gameId = uuidv4();//je donne une ID unique a ma game
                const currentGame = new Game(gameId, this.server, player1, player2, mapChoice, this.gs, this.us);
                this.games.push(currentGame);
                await currentGame.start();//la game commence
                const indexPlayer1 = playersAvailable.findIndex(player => player.socketId === player1.socketId);
                const indexPlayer2 = playersAvailable.findIndex(player => player.socketId === player2.socketId);
                
                if (indexPlayer1 !== -1) {
                    playersAvailable.splice(indexPlayer1, 1);
                }
                if (indexPlayer2 !== -1) {
                    playersAvailable.splice(indexPlayer2, 1);
                }
                if (currentGame.checkGameStatus() === true) {
                    this.removeGameById(gameId);
                }
            }
        }
    }

    returnNewSocket(userId: number): string {
        const existingUserIndex = this.userArray.findIndex(player => player.userid === userId);
        if (existingUserIndex !== -1) {
            return this.userArray[existingUserIndex].socketId;
        }
        else
            return "undefined";
    }
    
    private addUser(item: string, mapChoice: number, userI: number, user2: number): void {
        const existingUserIndex = this.userArray.findIndex(player => player.userid === userI);
		if (existingUserIndex === -1) {//si le user n'existe pas encore, alors le creer
            const newPlayer: Player = {
				socketId: item,
				status: playerStatus.isSettling,
				level: 0,
				map: mapChoice,
				userid: userI,
				user2: user2
			};
            this.userArray.push(newPlayer);
        }
        else {
            this.userArray[existingUserIndex].socketId = item;//sinn il existe deja donc on ecrase sa socket avec la nouvelle socket
            this.UpdatePlayer(item, this.userArray[existingUserIndex].userid);
            this.userArray[existingUserIndex].user2 = user2;
            this.userArray[existingUserIndex].map = mapChoice;
        }
    }

    private removeUser(socket: string): void {
        const indexToRemove = this.userArray.findIndex(player => player.socketId === socket);
        if (indexToRemove !== -1) {
            this.userArray.splice(indexToRemove, 1);
        }
        return ;
    }

	private removeGameById = (idToRemove: string) => {
		this.games = this.games.filter((game) => game.getGameId() !== idToRemove);
	};
}