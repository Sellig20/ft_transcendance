import { Controller, Get, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Public } from 'src/auth/utils/custo.deco';
import { FrontUserDto } from './UserDto';
import { log } from 'console';

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

	@Get('/test')
	hello() {
		return { msg: 'yep yep' };
	}
}
