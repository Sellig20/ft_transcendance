import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { WebsocketService } from './websocket.service';
import { Socket } from 'socket.io';

@WebSocketGateway(8001, { 
  // namespace: 'chat',
  cors: '*'})
export class WebsocketGateway {

  constructor(private readonly websocketsService: WebsocketService) {}

  @WebSocketServer() server: Server;
  async afterInit(serv: Server) {
    console.log("FELICITATION websocket connect")
    serv.on('connection', async (socket: Socket) => {
      await this.websocketsService.registerSocket(socket);
    });
  }

  async handleConnection(socket: Socket) {
    socket;
  }

  async handleDisconnect(socket: Socket) {
    this.websocketsService.unregisterSocket(socket);
  }

}
