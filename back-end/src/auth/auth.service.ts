import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService
	) {}
	async findUser (email: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		return user;
	}
}
