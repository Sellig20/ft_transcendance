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
}
