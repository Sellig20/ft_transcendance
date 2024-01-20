import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDetails } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	validateUser(details: UserDetails) {
		console.log('authservice');
		this.findUser(details.email)
		
	}

	async findUser (email: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		return user;
	}

	async signin(user: any) {
		const payload = {username: user.username, sub: user.id}
		return {
			access_token: this.jwt.sign(payload)
		}
	}
	readToken(token: { access_token: string; }){
		return  this.jwt.decode(token.access_token);
	}
}
