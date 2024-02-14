import { Controller, Get, Post, Req, Res, Param, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';


@Controller('chat')
export class ChatController {
	constructor(
		private prisma: PrismaService,
		private ChatService: ChatService
	) { }

	// @Get()
	// async getAnyUser() {
	// 	return await this.prisma.user.findMany();
	// }

	// @Get('/login')
	// async getOnConnection(@Req() req) {

	// 	const id_from_res = req.user.id
	// 	let userfront = new FrontUserDto();
	// 	const temp = await this.prisma.user.findFirst({
	// 		where: {
	// 			id: id_from_res
	// 		}
	// 	})
	// 	userfront.email = temp.email;
	// 	userfront.id = temp.id;
	// 	userfront.username = temp.username;
	// 	userfront.tfa_status = temp.TFA_activated
		
	// 	return userfront
	// }


	@Get('/test/:id')
	async hello(@Param() param) {
		
		return await this.ChatService.findUserById(Number(param.id));
	}
	
	@Get('/getUserById/:id')
	async getUserById(@Param() param) {
		
		return await this.ChatService.findUserById(Number(param.id));
	}

	// find toutes les infos du channel(id) + tous les messages
	@Get('/findAllInfoInChannelById/:id')
	async findAllInfoInChannelById(@Param() param) {
		
		return await this.ChatService.findAllInfoInChannelById(Number(param.id));
	}

	// find tous les channels joined par le user(id)
	@Get('/findAllChannelJoinedByIdUser/:id')
	async findAllChannelJoinedByIdUser(@Param() param) {
		
		return await this.ChatService.findAllChannelJoinedByIdUser(Number(param.id));
	}

	// find toutes les socket actuellement connecte au channel(id)
	@Get('/findAllSocketOnChannelByIdChannel/:id')
	async findAllSocketOnChannelByIdChannel(@Param() param) {
		
		return await this.ChatService.findAllSocketOnChannelByIdChannel(Number(param.id));
	}

	@Post('/createChannel')
	async createChannel(@Body() body) {
		// const user = req.user;
		// (
		// 	name: string, 
		// 	isPersonal: boolean,
		// 	isPublic: boolean,
		// 	idUser: number,
		// 	password: string
		// )
		const result = await this.ChatService.createChannel(body.name, body.isPersonal, body.isPublic, body.idUser, body.password);
		// console.log(result);
		return result
	}
}