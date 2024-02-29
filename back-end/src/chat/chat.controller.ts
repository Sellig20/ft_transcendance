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
			const res = await this.ChatService.findAllInfoInChannelById(Number(param.id));
			return (res)
		} catch (error) {
			throw error
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
		let password_final;
		if (body.password === undefined || body.password === null || body.password === "")
			password_final = null
		else
			password_final = body.password
		try {
			const result = await this.ChatService.createChannel(body.name, body.isPersonal, body.isPublic, body.idUser, password_final);
			await this.ChatService.connectUserToChannel(body.idUser, result.id);
		} catch (error) {
			throw (error)
		}
	}

	@Post('/leaveChannelById')
	async leaveChannelById(@Body() body) {
		// verifier si le userid est le owner 
		let owner_id = null
		let is_alone = false
		// console.log("sdfsdfsdfsdfsdfsfsf", infochann, body.channelid)
		try {
			const infochann = await this.ChatService.findAllInfoInChannelById(body.channelid);
			if(infochann.owner === body.userid)
			{
				// replace_owner(body.userid, infochann)
				if (infochann.admins.length !== 0)
				{
					await this.ChatService.leaveChannelById(body.userid, body.channelid);
					await this.ChatService.setOwner(body.channelid, infochann.admins[0]);
					return ;
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
		} catch (error) {
			throw error
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
			await this.ChatService.leaveChannelById(body.userid, body.channelid)
			let channelinfo = await this.ChatService.findAllInfoInChannelById(body.channelid)
			if (channelinfo.banned.indexOf(body.userid) === -1)
				await this.ChatService.addBannedUser(body.userid, body.channelid)
			else
			{
				throw new ForbiddenException("Error already banned", {
					cause: new Error(),
					description: "error already banned",
				});
			}
		} catch (error) {
			throw error
		}	
	}

	@Post('/blockUserById')
	async blockUserById(@Body() body) {
		try {
			const res = await this.ChatService.getblockedUserById(body.userid)
			if (res.blocked_user.indexOf(body.userToBlock) !== -1)
			{
				throw new ForbiddenException("Error already blocked", {
					cause: new Error(),
					description: "error already blocked",
				});
			}
			await this.ChatService.blockUserById(body.userid, body.userToBlock)
		} catch (error) {
			throw error
		}
	}

	@Post('/setAdminById')
	async setAdminById(@Body() body) {
		try {
			const res1 = await this.ChatService.getAdminInChannelById(body.channelId)
			if (res1.admins.indexOf(body.userToSet) === -1)
			{
				await this.ChatService.setAdminById(body.channelId, body.userToSet)
			}
			else
			{
				throw new ForbiddenException("Error already admin", {
					cause: new Error(),
					description: "error already admin",
				});
			}
		} catch (error) {
			throw error
		}
	}

	@Post('/muteById')
	async muteById(@Body() body) {
		try {
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
		} catch (error) {
			throw error
		}
	}

	@Post('/inviteUser')
	async inviteUser(@Body() body){
		try {
			let found;
			found = false
			const infochann = await this.ChatService.findAllInfoInChannelById(body.channelid)
			// console.log("caca", infochann.user_list)
			infochann.user_list.map((element: any, index:any) => {
				if (element.username === body.userid)
				{
					found = true
					return ;
				}
			})
			if (found === true)
			{
				
				throw new BadRequestException("error user already in channel", {
					cause: new Error(),
					description: "error user already in channel",
				});
			}

			
			const res = await this.ChatService.getUserIdByUsername(body.userid)
			const id = res.id

			if (infochann.banned.indexOf(id) !== -1)
			{
				throw new BadRequestException("error banned user", {
					cause: new Error(),
					description: "error banned user",
				});
			}

			await this.ChatService.connectUserToChannel(id, body.channelid)
		} catch (error) {
			throw error;
		}
	}

	@Post('/changePassword')
	async changePassword(@Body() body){
		try {
			if (body.password === undefined || body.password === null)
			{
				throw new BadRequestException("error invalid password", {
					cause: new Error(),
					description: "error invalid password",
				});
			}
			if (body.password === "")
				body.password = null
			await this.ChatService.setpassword(body.channelid, body.password)
		} catch (error) {
			throw error;
		}
	}
}
