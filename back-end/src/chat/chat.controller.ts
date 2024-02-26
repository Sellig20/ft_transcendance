import { Controller, Get, Post, Req, Res, Param, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import hash from 'src/auth/utils/hash';
import { ForbiddenException, BadRequestException } from '@nestjs/common';


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
		let final_password: string | null;
		if (body.password !== null && body.password !== "")
		{
			final_password = hash.hash(String(body.password))
		}
		else
			final_password = null
		console.log(final_password)
		const result = await this.ChatService.createChannel(body.name, body.isPersonal, body.isPublic, body.idUser, final_password);
		// console.log(result);
		return result
	}

	@Post('/leaveChannelById')
	async leaveChannelById(@Body() body) {
		// verifier si le userid est le owner 
		const result = await this.ChatService.leaveChannelById(body.userid, body.channelid);
		// console.log(result);
		return result
	}

	@Post('/banChannelById')
	async banChannelById(@Body() body) {
		let result
		try {
			const result = await this.ChatService.leaveChannelById(body.userid, body.channelid)
		} catch (error) {
			return (error)
		}
		try {
			let channelinfo = await this.ChatService.findAllInfoInChannelById(body.channelid)
			if (channelinfo.banned.indexOf(body.userid) === -1)
				await this.ChatService.addBannedUser(body.userid, body.channelid)
		} catch (error) {
			return (error)
		}	
		// console.log(result);
		return result
	}

	@Post('/blockUserById')
	async blockUserById(@Body() body) {
		let result
		
		const promise1 = this.ChatService.getblockedUserById(body.userid)
		Promise.all([promise1]).then(([res1]) => {
			if (res1.blocked_user.indexOf(body.userToBlock) !== -1)
					return null;

			try {
				this.ChatService.blockUserById(body.userid, body.userToBlock)
			} catch (error) {
				return (error)
			}
		})
		return result
	}

	@Post('/setAdminById')
	async setAdminById(@Body() body) {
		let result
		const res1 = await this.ChatService.getAdminInChannelById(body.channelId)
		if (res1.admins.indexOf(body.userToSet) === -1)
		{
			result = await this.ChatService.setAdminById(body.channelId, body.userToSet)
			return result
		}
		else
		{
			console.log("sdfgdfsgdfgdfg", res1.admins, body.userToSet)
			throw new ForbiddenException("Error in update", {
				cause: new Error(),
				description: "Error",
			});
		}
	}

	@Post('/muteById')
	async muteById(@Body() body) {
		let muted_users = await this.ChatService.getMutedUserInChannelById(body.channelId)
		let muted = muted_users.muted
		let time_now = Date.now()
		let data = {}
		const time_to_mute = 60000

		console.log(time_now, muted)
		if (muted === null)
		{
			// peut ajouter
			// console.log(time_now)
			data[body.userId] = time_now + time_to_mute
			// console.log(data)
			await this.ChatService.MuteUserInChannelById(body.channelId, data)
		}
		else
		{
			if (muted[body.userId] === undefined)
			{
				muted[body.userId] = time_now + time_to_mute
				await this.ChatService.MuteUserInChannelById(body.channelId, muted)
			}
			else
			{
				muted[body.userId] = muted[body.userId] + time_to_mute
				await this.ChatService.MuteUserInChannelById(body.channelId, muted)
			}
		}
		// if (muted_users[body.channelId])
		// {
		// 	result = await this.ChatService.setAdminById(body.channelId, body.userToSet)
		// 	return result
		// }
		// else
		// {
			// console.log("sdfgdfsgdfgdfg", res1.admins, body.userToSet)
			// throw new ForbiddenException("Error in update", {
			// 	cause: new Error(),
			// 	description: "Error",
			// });
		// }
	}
}
