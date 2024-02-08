import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
// import { AuthService } from 'src/user/user.service';

@WebSocketGateway(8001, { cors: '*'})
export class MyGateway implements OnModuleInit, OnGatewayConnection<Socket> {
    
    constructor(
		// private authService: AuthService,
		private userService: UsersService,
        private chatService: ChatService) { }
    
    @WebSocketServer()
    server: Server;

    private userArray: string[] = [];

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection', (socket) => {
            console.log("socket du server:", socket.id);
            console.log('-- ON MODULE INIT -- Connected in gateway.ts');
        })
    }

    private printAllUser(liste: string[]): void {
        if (this.userArray.length === 0)
            console.log(`[PRINT USERS]: NO SOCKETS CONNECTED`)
        else
        {
            this.userArray.forEach((item, index) => {
                console.log(`[PRINT USERS]: ${item} | USER INDEX : ${index}`);
            })
        }
    }

    private addUser(item: string): void {
        this.userArray.push(item);
        const index = this.userArray.indexOf(item);
    }

    private removeUser(item: string): void {
        if (this.userArray.length !== 0)
        {
            const index = this.userArray.indexOf(item);
            console.log(`[REMOVE USER LIST] SOCKET ID: ${item}`);
            this.userArray.splice(index, 1);
        }
    }
    
    async handleConnection(client: Socket, ...args: any[]) {
        console.log(`[HANDLE CONNECTION] Client connected: ${client.id}`);
        this.addUser(client.id);
        this.printAllUser(this.userArray);

        // ajout du socket a la table user
        // await this.chatService.setSocket(id du user connecte, client.id)
        // await this.chatService.setSocket(1, client.id)
    }

    async handleDisconnect(client: Socket){
        console.log(`[HANDLE DISCONNECT] Client disconnected: ${client.id}`);
        this.removeUser(client.id);
        this.printAllUser(this.userArray);

        // ajout du socket a la table user
        // await this.chatService.setSocket(id du user connecte, client.id)
        // await this.chatService.setSocket(1, null)
    }


    @SubscribeMessage('MP')
    async handleMessage(client: any, message: any) {
        if (message.data === "a")
        {
            this.server.to(this.userArray[0]).emit("MP", "ca marche");
            console.log("---create test database---")
            await this.chatService.createTest();
        }
        else
        {
            console.log("from:", message.to, "-->", message.data);
            this.server.emit("MP", message.data);   
            this.server.to(message.recipient).emit("MP", message.data);
        }
    }
}