import { Injectable } from '@nestjs/common';
import { VirtualTimeScheduler } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;
export type Channel = any;

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) { }

	async findUserId(userID: number) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userID,
			},
		});
		if (user)
			return user;
		return null
	}
	async findUserByMail(mail: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email: mail,
			},
		});
		return user;
	}

	async setTfaSecret(userID: number, secret: string) {
		await this.prisma.user.update({
			where: {
				id: userID
			},
			data: {
				TFA_secret_hash: secret
			}
		})
	}
	async setTfaOn(userID: number) {
		await this.prisma.user.update({
			where: {
				id: userID
			},
			data: {
				TFA_activated: true
			}
		})
	}

	async setTfaOff(userID: number) {
		await this.prisma.user.update({
			where: {
				id: userID
			},
			data: {
				TFA_activated: false
			}
		})
	}		

	async setSocket(userID: number, socketToUp: string) {
		await this.prisma.user.update({
			where: {
				id: userID
			},
			data: {
				socket: socketToUp
			}
		})
	}

	async findSocket(userID: number) {
		const user = await this.prisma.user.findMany({
			where: {
				id: userID
			}
		})
		return user;
	}

	async changeName(id: number, name: string) {
		let result
		try {
			result = await this.prisma.user.update({
				where: {
					id: id
				},
				data: {
					username: name
				}
			});
		} catch (error) {
			if (error.code === 'P2002') {
				console.log('There is a unique constraint violation');
			}
			throw new ForbiddenException('Error in update', { cause: new Error(), description: 'username must be unique' });

		}
		return result
	}

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
				user_list: {connect: {
					id:1
				}},
			},
		})

		const channel2: User = await this.prisma.channel.create({
			data: {
				name: 'channel2',
				personal: true,
			},
		})
	}
}
