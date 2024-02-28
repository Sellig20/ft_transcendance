import { Controller, Get, Post, Req, Res, Param, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import hash from 'src/auth/utils/hash';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { info } from 'console';


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
		try {
			return await this.ChatService.findUserById(Number(param.id));
		} catch (error) {
			return (error)
		}
	}
	
	@Get('/getUserById/:id')
	async getUserById(@Param() param) {
		try {
			return await this.ChatService.findUserById(Number(param.id));
		} catch (error) {
			return (error)
		}
	}

	// find toutes les infos du channel(id) + tous les messages
	@Get('/findAllInfoInChannelById/:id')
	async findAllInfoInChannelById(@Param() param) {
		try {
			return await this.ChatService.findAllInfoInChannelById(Number(param.id));
		} catch (error) {
			return (error)
		}
	}

	// find tous les channels joined par le user(id)
	@Get('/findAllChannelJoinedByIdUser/:id')
	async findAllChannelJoinedByIdUser(@Param() param) {
		try {
			return await this.ChatService.findAllChannelJoinedByIdUser(Number(param.id));
		} catch (error) {
			return (error)
		}
	}

	// find toutes les socket actuellement connecte au channel(id)
	@Get('/findAllSocketOnChannelByIdChannel/:id')
	async findAllSocketOnChannelByIdChannel(@Param() param) {
		try {
			return await this.ChatService.findAllSocketOnChannelByIdChannel(Number(param.id));
		} catch (error) {
			return (error)
		}
	}

	@Post('/createChannel')
	async createChannel(@Body() body) {
		let final_password: string | null;
		let result
		if (body.password !== null && body.password !== "")
		{
			final_password = hash.hash(String(body.password))
		}
		else
			final_password = null
		console.log(final_password)
		try {
			result = await this.ChatService.createChannel(body.name, body.isPersonal, body.isPublic, body.idUser, final_password);
			await this.ChatService.connectUserToChannel(body.idUser, result.id);
		} catch (error) {
			return (error)
		}
		// console.log(result);
		return result
	}

	@Post('/leaveChannelById')
	async leaveChannelById(@Body() body) {
		// verifier si le userid est le owner 
		let owner_id = null
		let is_alone = false
		const infochann = await this.ChatService.findAllInfoInChannelById(body.channelid);
		// console.log("sdfsdfsdfsdfsdfsfsf", infochann, body.channelid)
		try {
			if(infochann.owner === body.userid)
			{
				// replace_owner(body.userid, infochann)
				if (infochann.admins.length !== 0)
				{
					const result = await this.ChatService.leaveChannelById(body.userid, body.channelid);
					await this.ChatService.setOwner(body.channelid, infochann.admins[0]);
					return (result)
				}
				else
				{
					if (infochann.user_list.length <= 1) // alone in chann
					{
						is_alone = true
						const result = await this.ChatService.leaveChannelById(body.userid, body.channelid);
						await this.ChatService.setOwner(body.channelid, -1);
					}
					else
					{
						const result = await this.ChatService.leaveChannelById(body.userid, body.channelid);
						await this.ChatService.setOwner(body.channelid, infochann.user_list[0].id);
					}
				}
				
			}
			else
			{
				await this.ChatService.leaveChannelById(body.userid, body.channelid);
			}
			return "200"
		} catch (error) {
			return (error)
		}
		// try {
		// 	const result = await this.ChatService.leaveChannelById(body.userid, body.channelid);
		// 	if (is_alone === false)
		// 	return result
		// } catch (error) {
		// 	return "null"
		// }
		// console.log(result);
	}

	@Post('/banChannelById')
	async banChannelById(@Body() body) {
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
	}

	@Post('/blockUserById')
	async blockUserById(@Body() body) {
		try {
			const res = await this.ChatService.getblockedUserById(body.userid)
			if (res.blocked_user.indexOf(body.userToBlock) !== -1)
					return null;
			await this.ChatService.blockUserById(body.userid, body.userToBlock)
		} catch (error) {
			return (error)
		}
	}

	@Post('/setAdminById')
	async setAdminById(@Body() body) {
		try {
			const res1 = await this.ChatService.getAdminInChannelById(body.channelId)
			if (res1.admins.indexOf(body.userToSet) === -1)
			{
				const result = await this.ChatService.setAdminById(body.channelId, body.userToSet)
				return result
			}
			else
			{
				console.log("sdfgdfsgdfgdfg", res1.admins, body.userToSet)
				throw new ForbiddenException("Error in setadmin", {
					cause: new Error(),
					description: "error in setadmin",
				});
			}
		} catch (error) {
			return (error)
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
				if (muted[body.userId] < time_now)
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
