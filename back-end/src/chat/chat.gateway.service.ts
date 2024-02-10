import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
// import { AuthService } from 'src/user/user.service';

