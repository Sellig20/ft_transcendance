import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;

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
}
