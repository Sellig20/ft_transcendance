import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;
export type Channel = any;
export type Message = any;

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) { }
	
	async findUserById(userID: number) {
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
		return user;
	}

	async findSocketUserById(userID: number) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userID,
			},
			select: {
				socket: true
			}
		})
		return user;
	}

	async setSocket(userID: number, socketToUp: string) {
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
	}

	async setSocketUserById(userID: any, socketToUp: any) {
		await this.prisma.user.update({
			where: {
				id: userID
			},
			data: {
				socket: socketToUp
			}
		})
	}
	
	async findAllInfoInChannelById(channelId: number)
	{
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
		return channel;
	}

	async findAllChannelJoinedByIdUser(userId: number)
	{
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
		return channels;
	}

	async findAllSocketOnChannelByIdChannel(channelId: number)
	{
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
		return channels;
	}

	async createMessage(content: string, idUser: number, idChannel: number, sender_name: string)
	{
		await this.prisma.message.create({
			data: {
				content: content,
				sender: {connect: {id:idUser}},
				recipient: {connect: {id:idChannel}},
				sender_name : sender_name
			},

		})
	}

	async createChannel(
		name: string, 
		isPersonal: boolean,
		isPublic: boolean,
		idUser: number,
		password: string
	)
	{
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
	}

	async leaveChannelById(userID: number, channelID: number) {
		await this.prisma.user.update({
			where: {
				id: userID
			},
			data: {
				channel_list: {disconnect: [{id:channelID}]}
			}
		})
	}

	async addBannedUser(userId: number, channelID: number) {
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
	}

	async blockUserById(userId: number, userToBlock: number) {
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
	}

	async getblockedUserById(userId: number) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userId
			},
			select: {
				blocked_user: true,
			},
		})
		return user;
	}

// ---------------------- TEST FUNCTION -------------------------

	async createTest() {
		const user1: User = await this.prisma.user.create({
			data: {
				username: 'robin',
				email: 'mail1',
			},
		})

		const user2: User = await this.prisma.user.create({
			data: {
				username: 'louis',
				email: 'mail2',
			},
		})

		const user3: User = await this.prisma.user.create({
			data: {
				username: 'jeanne',
				email: 'mail3',
			},
		})

		const channel1: User = await this.prisma.channel.create({
			data: {
				name: 'channel1',
				personal: false,
				user_list: {connect: [{id:1}, {id:2}, {id:3}]}
				// user_list: {connect: {id:1}}
			},
		})

		const channel2: User = await this.prisma.channel.create({
			data: {
				name: 'channel2',
				personal: true,
				user_list: {connect: [{id:1}, {id:2}]}
			},
		})

		const message1: User = await this.prisma.message.create({
			data: {
				content: 'content_message1',
				sender: {connect: {id:1}},
				recipient: {connect: {id:2}}
			},
		})

		const message2: User = await this.prisma.message.create({
			data: {
				content: 'content_message2',
				sender: {connect: {id:2}},
				recipient: {connect: {id:2}}
			},
		})

		const message3: User = await this.prisma.message.create({
			data: {
				content: 'content_message3',
				sender: {connect: {id:1}},
				recipient: {connect: {id:1}}
			},
		})

		const message4: User = await this.prisma.message.create({
			data: {
				content: 'content_message4',
				sender: {connect: {id:2}},
				recipient: {connect: {id:1}}
			},
		})

		const message5: User = await this.prisma.message.create({
			data: {
				content: 'content_message5',
				sender: {connect: {id:3}},
				recipient: {connect: {id:1}}
			},
		})

		const setfriendship1: User = await this.prisma.user.update({
			where: {id: 1},
			data: {
				friends: {
					push: [2]
				}
			}
		})

		const setfriendship2: User = await this.prisma.user.update({
			where: {id: 2},
			data: {
				friends: {
					push: [1]
				}
			}
		})
		

	}
}
