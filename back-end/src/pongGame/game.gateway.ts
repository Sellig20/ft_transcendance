import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameStateBD} from "./gameStateBD";
@WebSocketGateway(8002, {
    namespace: 'game',
    cors: "*"
})

export class gatewayPong implements OnModuleInit, OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
    
    @WebSocketServer()
    server: Server;
    
    private userArray: string[] = [];
    private gameState: GameStateBD = new GameStateBD();

    constructor() {}

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection : ', (socket) => {
            console.log('Connection -> ', socket.id);
        })
    }

    private sendUAEvent() {
        this.server.emit('updateUA', { userArray: this.userArray });
    }

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

    @SubscribeMessage('handleCollision2')
    handleCollisionWithLeftBorder() {
        this.gameState.player2Score += 1;
        // console.log("player 2 score =>", this.gameState.player2Score)
        this.server.emit('updatePlayer2', this.gameState.player2Score );
    }

    @SubscribeMessage('handleCollision1')
    handleCollisionWithRightBorder() {
        this.gameState.player1Score += 1;
        // console.log("player 1 score =>", this.gameState.player1Score)
        this.server.emit('updatePlayer1', this.gameState.player1Score );
    }

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

    updateGame() {
        this.gameState.ball.x += this.gameState.ball.velocityX;
        this.gameState.ball.y += this.gameState.ball.velocityY;
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
            this.handleCollisionWithLeftBorder();
            this.resetBall(1);
        }
        else if (this.gameState.ball.x + this.gameState.ballWidth > this.gameState.boardWidth && !ballHitPaddle) {
            this.handleCollisionWithRightBorder();
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
        this.updateGame();
        this.detectingBorder();
        this.server.emit('borderCollision', this.gameState.ball.velocityY)
        let ballHitPaddle = false;
        this.detectingBallAgainstPaddle(ballHitPaddle);
        this.server.emit('collisionBall', this.gameState.ball.velocityX)
        this.ScoreAndResetBall(1, ballHitPaddle);
        this.server.emit('initBall', this.gameState.ball.x, this.gameState.ball.y)
        }, 16); // 16 ms (environ 60 FPS)
      }
    
    @SubscribeMessage('handleInitBallAndGame')
    handleInitialisationBall() {
        this.startGameLoop();
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
    
    handleConnection(client: Socket, ...args: any[]) {
        console.log("Le client connecte est -> ", client.id);
        this.addUser(client.id);
        this.sendUAEvent();

        const userIndex = this.userArray.indexOf(client.id);
        this.server.to(client.id).emit('yourUserId', userIndex + 1);

        this.server.emit('user-connected', { clientId: client.id, userArray: this.userArray});
        this.displayUserArray();
    }
    
    handleDisconnect(client: Socket, ...args: any[]) {
        this.removeUser(client.id);
        this.server.emit('user-disconnected', { clientId: client.id, userArray: this.userArray});
        this.sendUAEvent();
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
