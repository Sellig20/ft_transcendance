import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { connect } from 'http2';

// This should be a real class/interface representing a user entity
export type User = any;
export type Channel = any;
export type Message = any;

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) { }
	
	async findUserById(userID: number) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					id: userID,
				},
				select: {
					channel_list: {select: {
						id: true,
						name: true,
						personal: true,
						password: true,
						public: true
	
					}},
					friends: true,
					createAt: true,
					username: true,
					id: true,
					blocked_user: true
				}
			})
			if (user === null)
			{
				throw new BadRequestException("error while user not found", {
					cause: new Error(),
					description: "error while user not found",
				});
			}
			return user;
		} catch (error) {
			throw error
		}
	}

	async findSocketUserById(userID: number) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					id: userID,
				},
				select: {
					socket: true
				}
			})
			if (user === null)
			{
				throw new BadRequestException("error while socket not found", {
					cause: new Error(),
					description: "error while socket not found",
				});
			}
			return user;
		} catch (error) {
			throw error
		}
	}

	async setSocket(userID: number, socketToUp: string) {
		try {
			await this.prisma.user.update({
				where: {
					id: userID
				},
				data: {
					socket: {
						push: socketToUp
					}
				}
			})
		} catch (error) {
			throw error
		}
	}

	async setSocketUserById(userID: any, socketToUp: any) {
		try {
			await this.prisma.user.update({
				where: {
					id: userID
				},
				data: {
					socket: socketToUp
				}
			})
		} catch (error) {
			throw error
		}
	}

	async findAllInfoInChannelById(channelId: number)
	{
		try {
			const channel = await this.prisma.channel.findFirst({
				where: {
					id: channelId
				},
				select : {
					id: true,
					name: true,
					messages: true,
					personal: true,
					public: true,
					admins: true,
					banned: true,
					owner: true,
					muted: true,
					password: true,
					user_list: {select: {
						id: true,
						username: true,
						friends: true,
						socket: true,
						blocked_user: true,
	
					}}
				}
	
			})
			if (channel === null)
			{
				throw new BadRequestException("error while channel not found", {
					cause: new Error(),
					description: "error while channel not found",
				});
			}
			return channel;
		} catch (error) {
			throw error
		}
	}

	async findAllChannelJoinedByIdUser(userId: number)
	{
		try {
			const channels = await this.prisma.user.findMany({
				where: {
					id: userId
				},
				select : {
					channel_list: {select: {
						id: true,
						name: true,
						personal: true,
						public: true,
						banned: true,
						password: true
					}}
				}
	
			})
			if (channels === null)
			{
				throw new BadRequestException("error while channel not found", {
					cause: new Error(),
					description: "error while channel not found",
				});
			}
			return channels;
		} catch (error) {
			throw error
		}
	}

	async findAllSocketOnChannelByIdChannel(channelId: number)
	{
		try {
			const channels = await this.prisma.channel.findFirst({
				where: {
					id: channelId
				},
				select : {
					user_list: {select: {
						id: true,
						username: true,
						socket: true,
					}}
				}
			})
			if (channels === null)
			{
				throw new BadRequestException("error while channel not found", {
					cause: new Error(),
					description: "error while channel not found",
				});
			}
			return channels;
		} catch (error) {
			throw error
		}
	}

	async createMessage(content: string, idUser: number, idChannel: number, sender_name: string)
	{
		try {
			await this.prisma.message.create({
				data: {
					content: content,
					sender: {connect: {id:idUser}},
					recipient: {connect: {id:idChannel}},
					sender_name : sender_name
				},
	
			})
		} catch (error) {
			throw error
		}
	}

	async createChannel(
		name: string, 
		isPersonal: boolean,
		isPublic: boolean,
		idUser: number,
		password: string
	)
	{
		try {
			const res = await this.prisma.channel.create({
				data: {
					name: name,
					password: password,
					personal: isPersonal,
					public: isPublic,
					user_list: {connect: [{id:idUser}]},
					owner: idUser,
				},
	
			})
			return res;
		} catch (error) {
			throw error
		}
	}

	async leaveChannelById(userID: number, channelID: number) {
		try {
			await this.prisma.user.update({
				where: {
					id: userID
				},
				data: {
					channel_list: {disconnect: [{id:channelID}]}
				}
			})
		} catch (error) {
			throw error
		}
	}

	async addBannedUser(userId: number, channelID: number) {
		try {
			await this.prisma.channel.update({
				where: {
					id: channelID
				},
				data: {
					banned: {
						push: [userId]
					}
				}
			})
		} catch (error) {
			throw error
		}
	}

	async blockUserById(userId: number, userToBlock: number) {
		try {
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					blocked_user: {
						push: [userToBlock]
					}
				}
			})
		} catch (error) {
			throw error
		}
	}

	async getblockedUserById(userId: number) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					id: userId
				},
				select: {
					blocked_user: true,
				},
			})
			if (user === null)
			{
				throw new BadRequestException("error while user not found", {
					cause: new Error(),
					description: "error while user not found",
				});
			}
			return user;
		} catch (error) {
			throw error
		}
	}

	async setAdminById(channelId: number, userToSet: number) {
		try {
			await this.prisma.channel.update({
				where: {
					id: channelId
				},
				data: {
					admins: {
						push: [userToSet]
					}
				}
			})
		} catch (error) {
			throw error
		}
	}

	async getAdminInChannelById(channelId: number) {
		try {
			const channel = await this.prisma.channel.findFirst({
				where: {
					id: channelId
				},
				select: {
					admins: true,
				},
			})
			if (channel === null)
			{
				throw new BadRequestException("error while channel not found", {
					cause: new Error(),
					description: "error while channel not found",
				});
			}
			return channel;
		} catch (error) {
			throw error
		}
	}

	async getMutedUserInChannelById(channelId: number) {
		try {
			const channel = await this.prisma.channel.findFirst({
				where: {
					id: channelId
				},
				select: {
					muted: true,
				}
			})
			if (channel === null)
			{
				throw new BadRequestException("error while channel not found", {
					cause: new Error(),
					description: "error while channel not found",
				});
			}
			return (channel)
		} catch (error) {
			throw error
		}
	}

	async MuteUserInChannelById(channelId: number, dataaa: any) {
		try {
			await this.prisma.channel.update({
				where: {
					id: channelId
				},
				data: {
					muted: dataaa
				}
			})
		} catch (error) {
			throw error
		}
	}

	async connectUserToChannel(userid: number, channelid: number) {
		try {
			await this.prisma.channel.update({
				where: {
					id: channelid
				},
				data: {
					user_list: {connect: {id:userid}}
				}
			})
		} catch (error) {
			throw error
		}
	}

	async setOwner(channelid: number, userid: number) {
		try {
			await this.prisma.channel.update({
				where: {
					id: channelid
				},
				data: {
					owner: {set: userid}
				}
			})
		} catch (error) {
			throw error
		}
	}

	async getUserIdByUsername(username: string) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					username: username
				},
				select: {
					id: true
				}
			})
			if (user === null)
			{
				throw new BadRequestException("error user not found", {
					cause: new Error(),
					description: "error user not found",
				});
			}
			return (user)
		} catch (error) {
			throw error
		}
	}

	async setpassword(channelid: number, password: string) {
		try {
			await this.prisma.channel.update({
				where: {
					id: channelid
				},
				data: {
					password: {set: password}
				}
			})
		} catch (error) {
			throw error
		}
	}

	async findAllPublicChannel()
	{
		try {
			const channel = await this.prisma.channel.findMany({
				where: {
					public: true
				},
				select : {
					id: true,
					name: true,
					personal: true,
					password: true,
					public: true,
				}
	
			})
			if (channel === null)
			{
				throw new BadRequestException("error while channel not found", {
					cause: new Error(),
					description: "error while channel not found",
				});
			}
			return channel;
		} catch (error) {
			throw error
		}
	}

	async findAllChannelJoinedId(iduser: number)
	{
		try {
			const channels = await this.prisma.user.findFirst({
				where: {
					id: 11
				},
				select : {
					channel_list : {
						select : {
							id: true,
							name: true,
							personal: true,
							password: true,
							public: true,
						}
					}
				}
	
			})
			if (channels === null)
			{
				throw new BadRequestException("error while channel not found", {
					cause: new Error(),
					description: "error while channel not found",
				});
			}
			return channels;
		} catch (error) {
			throw error
		}
	}
}
