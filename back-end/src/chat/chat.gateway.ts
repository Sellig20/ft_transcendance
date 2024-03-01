import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
// import { AuthService } from 'src/user/user.service';

@WebSocketGateway(8001, { 
    // namespace: 'chat',
    cors: '*'})
export class MyGateway implements OnModuleInit, OnGatewayConnection<Socket> {
    
    constructor(
		// private authService: AuthService,
		private userService: UsersService,
        private chatService: ChatService) { }
    
    @WebSocketServer()
    server: Server;

    private userArray: any[] = [];

    onModuleInit() {
        this.server.on('-- ON MODULE INIT -- connection', (socket) => {
            console.log("socket du server:", socket.id);
            console.log('-- ON MODULE INIT -- Connected in gateway.ts');
        })
    }

    private printAllUser(liste: any[]): void {
        if (this.userArray.length === 0)
            console.log(`[PRINT USERS]: NO SOCKETS CONNECTED`)
        else
        {
            this.userArray.forEach((item, index) => {
                console.log(`[PRINT USERS]: ${item.iduser} ${item.idsocket} | USER INDEX : ${index}`);
            })
        }
    }

    private addUser(idUser: string, idSocket:string): void {
        this.userArray.push({idsocket: idSocket, iduser: idUser});
        // const index = this.userArray.indexOf(item);
    }

    
    private async removeUser(idsocket: string): Promise<void> {
        if (this.userArray.length !== 0)
        {
            let indexx = -1;
            this.userArray.map((item, index) => {
                // console.log("[DEBUGGG] LISTE DES SOCKET DANS USER_ARRAY", item.idsocket)
                if(idsocket === item.idsocket)
                indexx = index
        })
        // console.log("[DEBUGGG] INDEX A VIRER", indexx)
        if(indexx !== -1)
        {
            // console.log(`[REMOVE USER LIST] SOCKET ID: ${idsocket} ${this.userArray[indexx].iduser}`);
            // await this.chatService.findSocketUserById(Number(this.userArray[indexx].iduser)).then(res => {
                //     let list_socket = res.socket
                //     list_socket.map((item, index) => {
                    //         // console.log(item, index)
                    //         if (item === idsocket)
                    //         list_socket.splice(index, 1)
                    //     })
                    //     // console.log(list_socket)
                    //     this.chatService.setSocketUserById(Number(this.userArray[indexx].iduser), list_socket)
                    this.userArray.splice(indexx, 1);
                    // })
                }
            }
    }
    
    private async isMutedInChannel(userId: string, idChannel:number) : Promise<boolean> {
        let muted = await this.chatService.getMutedUserInChannelById(idChannel)
        let time_now = Date.now()
        if (muted.muted === null)
            return false;
        if (muted.muted[userId] === undefined)
            return false
        if (time_now < muted.muted[userId])
            return (true);
        return (false)
    }

    // cherche tout les socket du channel
    async findSocketChannels(channel_id: number) {
        let liste_socket = []
        let res = await this.chatService.findAllSocketOnChannelByIdChannel(channel_id)
            const liste = res.user_list
            liste.map((item, index) => {
                // console.log(item.socket)
                liste_socket.push(...item.socket)
            })
            // console.log(liste_socket)
            // return (liste_socket)
        return (liste_socket)
    }
    
    async handleConnection(client: Socket, ...args: any[]) {
        console.log(`[HANDLE CONNECTION] Client connected: ${client.id}`);
        this.server.to(client.id).emit("FIRST", {msg:"who are you"})
    }

    async handleDisconnect(client: Socket){
        console.log(`[HANDLE DISCONNECT] Client disconnected: ${client.id}`);
        this.removeUser(client.id);
        this.printAllUser(this.userArray);
        // emit la question de qui tu es ??????
    }


    @SubscribeMessage('MP')
    async handleMessage(client: any, message: any)
    {
        // console.log(client.name)
        // console.log(message)
        console.log("from_socket:", message.from_socket, message.from_user_name, "-->", message.data, ", to:", message.to);
        // this.server.emit("MP", {content:message.data, to:message.to, from:client.id});   
        // this.server.to(message.recipient).emit("MP", message.data);
        
        let res = await this.findSocketChannels(message.to)
        res.map((item, index) => {
            // console.log("envoie de '", message.data, "' to socketid :", item)
            this.server.to(item).emit("MP", {
                from_channel: message.to,
                from_user:message.from_user,
                from_user_name:message.from_user_name,
                data:message.data
            });
        })
        const isMutedNow = await this.isMutedInChannel(message.from_user, message.to)
        if (isMutedNow === false)
            this.chatService.createMessage(message.data, message.from_user, message.to, message.from_user_name)
    }

    @SubscribeMessage('FIRST')
    async handleMessageconnection(client: any, message: any) {
        console.log("FIRST", message.userid, client.id)
        await this.chatService.setSocket(Number(message.userid), client.id)
        client.name = message.userid
        this.addUser(message.userid, client.id);
        this.printAllUser(this.userArray);
    }

    @SubscribeMessage('RELOAD')
    async handleReload(client: any, message: any) {
        console.log("reload all the user", message.channelid)
        // await this.findSocketChannels(message.channelid).then(res => {
        //     res.map((item, index) => {
        //         // console.log("envoie de '", message.data, "' to socketid :", item)
        //         this.server.to(item).emit("RELOAD", {
        //             channelid: message.channelid
        //         });
        //     })
        // })
        
        // this.userArray.map((item, index) => {
            // console.log("envoie de '", message.data, "' to socketid :", item)
            this.server.emit("RELOAD", {
                channelid: message.channelid
            });
        // })
    }

}