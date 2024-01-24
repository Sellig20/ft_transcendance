import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
    },
})
export class MyGateway implements OnModuleInit, OnGatewayConnection<Socket> {

    @WebSocketServer()
    server: Server;

    private userArray: string[] = [];

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('Connected in gateway.ts');
        })
    }
    
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
        this.addUser(client.id);
    }

    private addUser(item: string): void {
        this.userArray.push(item);
        console.log(`User added: ${item}`);

    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        this.server.emit('onMessage', {
            msg: 'New Message',
            content: body,
        });
    }

    // @SubscribeMessage('movePaddle')
    // handleMovePaddle(@MessageBody() data: { direction: string }, @ConnectedSocket() client: Socket) {
    //     this.server.emit('paddleMoved', data);
    // }
    
    @SubscribeMessage('keydown')
    handleKeyPressed(client: Socket, data: { key: string }) {
        console.log('PADDLE MOVED:', data, 'by', client.id);
        client.emit('keyPressedResponse', { message: 'Server received key press' });
    }
}