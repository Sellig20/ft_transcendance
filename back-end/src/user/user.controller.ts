import { Body, Controller, Get, Post, Req, Res, Patch, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FrontUserDto, StatsDto } from './UserDto';
import hashService from '../auth/utils/hash'
import { Public } from 'src/auth/utils/custo.deco';
import { UsersService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { stat } from 'fs';

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

	@Post('/upload')
	@UseInterceptors(
		FileInterceptor('avatar'),
	)
	async uploadedFile(@Req() req, @UploadedFile(
		new ParseFilePipe({
		validators: [
			new MaxFileSizeValidator({maxSize: 2097152}),
			new FileTypeValidator({ fileType: 'image/jpeg'})
		]
		})
	) file) {
		this.userservice.saveImg(req.user.id, file.filename);
		
		return file.filename;
	}

	@Get('/avatar:filename')
	serveAvatar(@Param('filename') filename: string, @Res() res: Response) {
		// console.log('looking for  ', filename);
		return res.sendFile(filename, { root: join(__dirname, '../..', 'avatar') });
	}

	@Get('/myavatar')
	async serveMyAvatar(@Req() req,  @Res() res: Response){
		const img_name = await this.userservice.myAvatar(req.user.id)

		if (img_name === 'placeholder'){
			return res.sendFile("avatarDefault", { root: join(__dirname, '../..', 'avatar') });
		}
		else {
			return res.sendFile(img_name, { root: join(__dirname, '../..', 'avatar') });
		}
	}

	@Get('/status:id')
	async getstatus(@Req() req) {
		// @Param('id', ParseIntPipe) id: number
		// const result = await this.userservice.checkStatus(id)
		const result = await this.userservice.checkStatus(req.user.id);
		return result
	}

	@Patch('/changeStatus')
	async changeStatus(@Req() req, @Body() body) {
		console.log('change status activated : page closed detected');
			
		const result = await this.userservice.changeStatus(req.user.id, body.status)
		return result
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

	@Get('/stats')
	async userstats(@Req() req){
		let stats = new StatsDto();
		let db_stats = await this.userservice.dbStats(req.user.id);
		stats = {...db_stats};
		
		stats.level = this.userservice.calcLevel(stats.win, stats.lose);
		if (stats.level > 5)
		{
			await this.userservice.updateAchivement(1, req.user.id);
			stats.success_one = true;
		}
		// if (stats.level > 5)
		// {
		// 	this.userservice.updateAchivement(1);
		// 	stats.success_one = true;
		// }
		if (stats.win + stats.lose >= 10)
		{
			await this.userservice.updateAchivement(3, req.user.id);
			stats.success_one = true;
		}

		return(stats)
	}
}
