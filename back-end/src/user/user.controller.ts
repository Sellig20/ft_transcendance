import { Controller, Get, PayloadTooLargeException, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FrontUserDto } from './UserDto';
import hashService from '../auth/utils/hash'
import { Public } from 'src/auth/utils/custo.deco';

@Controller('user')
export class UserController {
	constructor(private prisma: PrismaService) { }

	@Get()
	async getAnyUser() {
		return await this.prisma.user.findMany();
	}

	@Get('/login')
	async getOnConnection(@Req() req) {

		const id_from_res = req.user.id
		let userfront = new FrontUserDto();
		const temp = await this.prisma.user.findFirst({
			where: {
				id: id_from_res
			}
		})
		userfront.email = temp.email;
		userfront.id = temp.id;
		userfront.username = temp.username;
		userfront.tfa_status = temp.TFA_activated
		
		return userfront
	}

	@Public()
	@Get('/cipher')
	async hello() {
		let normalString = 'bonjour'
		console.log('on va cipher: ', normalString);
		normalString = await hashService.hash(normalString);
		console.log('string cryptee: ', normalString);
		normalString = await hashService.decipher(normalString);
		console.log('string decryptee: ', normalString);
		
		return { msg: 'yep yep' };
	}
}
