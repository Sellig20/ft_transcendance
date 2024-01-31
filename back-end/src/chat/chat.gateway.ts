import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8001, { cors: '*'})
export class MyGateway implements OnModuleInit, OnGatewayConnection<Socket> {

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
    
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`[HANDLE CONNECTION] Client connected: ${client.id}`);
        this.addUser(client.id);
        this.printAllUser(this.userArray);
    }

    handleDisconnect(client: Socket){
        console.log(`[HANDLE DISCONNECT] Client disconnected: ${client.id}`);
        this.removeUser(client.id);
        this.printAllUser(this.userArray);

    }


    @SubscribeMessage('MP')
    handleMessage(client: any, message: any): void {
        // if (message === "test")
        // {
            this.server.to(this.userArray[0]).emit("MP", "message de test pour client 1");   
        // }
        // else
        // {
            console.log("from:", message.to, "-->", message.data);
            this.server.emit("MP", message.data);   
            this.server.to(message.recipient).emit("MP", message.data);   
        // }
    }
}