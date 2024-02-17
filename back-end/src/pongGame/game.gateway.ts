import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameStateBD} from "./gameStateBD";
import { Game } from "./game.class";
@WebSocketGateway(8001, {
    // namespace: 'game',
    cors: "*"
})

export class gatewayPong implements OnModuleInit, OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
    
    @WebSocketServer()
    server: Server;
    
    private userArray: string[] = [];// BUG CHANGE THIS
    private gameState: GameStateBD = new GameStateBD();
    games: Game[] = [];

    constructor() {}

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection : ', (socket) => {
            console.log('Connection -> ', socket.id);
        })
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log("Le client connecte est -> ", client.id);
        // this.addUser(client.id);
    
        const userIndex = this.userArray.indexOf(client.id);
        // this.server.to(client.id).emit('yourUserId', userIndex + 1);
    
        // this.server.emit('user-connected', { clientId: client.id, userArray: this.userArray});
        // this.displayUserArray();
    }
    
    handleDisconnect(client: Socket, ...args: any[]) {
        // this.removeUser(client.id);
        this.server.emit('user-disconnected', { clientId: client.id, userArray: this.userArray});
        // this.sendUAEvent();
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

    
}
