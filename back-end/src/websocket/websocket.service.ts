import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WebsocketService {
    private test : Map<number, Socket[]> = new Map()
    private sockets: Socket[] = []; // TODO Change the array
    private _socketsOnClose = new Map();

    constructor(
        // private readonly jwt: JwtService,
        // private readonly prismaService: PrismaService,
        // private readonly config: ConfigService,
        // @Inject(forwardRef(() => GameService))
        // private readonly game: GameService, // private readonly game: GameService,
    ) { }

    async registerSocket(socket: any) {
        socket.on('close', () => {
            this.sockets = this.sockets.filter((s: any) => s !== socket);
        });
        // TODO Check for connection websocket
    

        // TODO Get clientId

        // this.test[]


        // console.log(socket.handshake.headers.cookie)

        // const token = socket.handshake.auth.token;
        // if (!token) {
        //     this.send(socket, 'error', 'No token found');
        //     socket.disconnect();
        //     return;
        // }
        // try {
        //     const verify = this.jwt.verify(token, {
        //         secret: this.config.get('JWT_SECRET'),
        //     });
        //     if (!verify || !verify.id) {
        //         this.send(socket, 'error', 'No user found');
        //         socket.disconnect();
        //         return;
        //     }
        //     const user = await this.prismaService.user.findUnique({
        //         where: { id: verify.id },
        //     });
        //     if (!user) {
        //         this.send(socket, 'error', 'No user cookie');
        //         socket.disconnect();
        //         return;
        //     }
        //     if (this.getSockets([user.id]).length > 0) {
        //         this.send(socket, 'error_socket', {
        //             message: 'You are already connected',
        //         });
        //         socket.disconnect();
        //         return;
        //     }
        //     await this.prismaService.user.update({
        //         where: { id: user.id },
        //         data: { status: 'ONLINE' },
        //     });
        //     this.sendToAll(this.sockets, 'user_status', {
        //         nickname: user.nickname,
        //         status: 'ONLINE',
        //     });
        //     socket['user'] = user;
        //     this.sockets.push(socket);
        //     this.game.send_all_invitation(socket);
        // } catch (e) {
        //     this.send(socket, 'error_socket', {
        //         message: 'Server got a problem need to be relog',
        //     });
        //     socket.disconnect();
        //     return;
        // }
    }

    // async modifyTheUserSocket(id: number) {
    //     const socket: any = this.getSockets([id])[0];
    //     const user = await this.prismaService.user.findUnique({
    //         where: { id: id },
    //     });
    //     if (!socket) return;
    //     socket['user'] = user;
    //     this.sockets.push(socket);
    //     return;
    // }

    registerOnClose(socket: any, action: () => void) {
        this._socketsOnClose.set(socket, [
            ...(this._socketsOnClose.get(socket) || []),
            action,
        ]);
    }

    async unregisterSocket(socket: any) {
        console.log("DISCONNECT USER")
        // this.sockets = this.sockets.filter((s) => s !== socket);
        // const actions = this._socketsOnClose.get(socket);
        // if (actions) {
        //     actions.forEach((action: () => void) => action());
        // }
        // if (!socket.user) return;
        // await this.prismaService.user.update({
        //     where: { id: socket.user.id },
        //     data: { status: 'OFFLINE' },
        // });
        // this.broadcast('user_status', {
        //     nickname: socket.user.nickname,
        //     status: 'OFFLINE',
        // });
        // this.game.delete_invitation(socket, socket.user);
    }

    send(client: any, event: string, data: any) {
        if (!client) return;
        client.emit(event, data);
    }

    // getSockets(usersId: number[]) {
    //     return this.sockets.filter((socket: any) => {
    //         return usersId.includes(socket.user.id);
    //     });
    // }

    // sendToAllUsers(usersId: number[], event: string, data: any) {
    //     const receivers = this.getSockets(usersId);
    //     this.sendToAll(receivers, event, data);
    // }

    sendToAll(sockets: any[], event: string, data: any) {
        sockets.forEach((socket) => {
            this.send(socket, event, data);
        });
    }

    broadcast(event: string, data: any) {
        this.sendToAll(this.sockets, event, data);
    }
}

