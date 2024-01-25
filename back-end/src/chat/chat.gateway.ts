// import { MessageBody,
//   MessageMappingProperties,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer 
// } from '@nestjs/websockets';

// @WebSocketGateway(8001, { cors: '*'})
// export class ChatGateway {
//   @WebSocketServer()
//   server;
//   @SubscribeMessage('MP')
//   handleMessage(@MessageBody() message: string): void {
//     console.log(message);
//     this.server.emit("MP", message);
//   }
// }


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

    private addUser(item: string): void {
        this.userArray.push(item);
        const index = this.userArray.indexOf(item);
        // console.log(`User added: ${item}`);
        console.log(`[TOTAL SOCKET] SOCKET INDEX : ' ${index} 'SOCKET ID : ${item}`);
        console.log();
        // this.userArray.forEach((item, index) => {
        //     console.log(`[ADD USER] -- USER ID : ${item} | USER INDEX : ${index}`);
        // })
        // console.log();
    }
    
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`[HANDLE CONNECTION] New Client connected: ${client.id}`);
        this.addUser(client.id);
    }

    handleDisconnect(client: Socket){
        // this.logger.log(`lient disconnected ${client.id}`)
        console.log(`[HANDLE DISCONNECT] New Client disconnected: ${client.id}`);
    }


    @SubscribeMessage('MP')
    // handleMessage(@MessageBody() message: string): void {
    handleMessage(client: any, message: any): void {
        console.log(message);
        console.log(client.id);
        this.server.emit("MP", message);
    }
}