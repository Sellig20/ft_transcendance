import { Body, Controller, Get, Post, Req, Res, Headers, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Express } from 'express'
import { FrontUserDto } from './UserDto';
import hashService from '../auth/utils/hash'
import { Public } from 'src/auth/utils/custo.deco';
import { UsersService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
	constructor(
		private prisma: PrismaService,
		private userservice: UsersService
		) { }

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

	@Post('/name')
	async changeUserName(@Req() req, @Body() body) {
		const user = req.user;
		const result = await this.userservice.changeName(user.id, body.name);
		console.log(result);
		return result
	}


	// @Post('/upload')
	// @UseInterceptors(
	// 	FileInterceptor('avatar')
	// )
	// async uploadFile(@UploadedFile(
	// 	new ParseFilePipe({
	// 	validators: [
	// 		new MaxFileSizeValidator({maxSize: 1000 * 1000 *10}),
	// 		new FileTypeValidator({ fileType: 'image/jpeg'})
	// 	]
	// 	})
	// ) file) {
	// // 	const response = {
	// // 		originalname: file.originalname,
	// // 		filename: file.filename,
	// // 	};
	// // 	return response;
	// // }


	@Post('/upload')
	@UseInterceptors(
		FileInterceptor('avatar'),
	)
	async uploadedFile(@UploadedFile(
		new ParseFilePipe({
		validators: [
			new MaxFileSizeValidator({maxSize: 2097152}),
			new FileTypeValidator({ fileType: 'image/jpeg'})
		]
		})
	) file) {
		const response = {
			originalname: file.originalname,
			filename: file.filename,
		};
		return response;
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
