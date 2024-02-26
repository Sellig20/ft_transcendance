import { Body, Controller, Get, Post, Req, Res, Patch, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Param, ParseIntPipe, BadRequestException, HttpCode } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FrontUserDto, StatsDto } from './UserDto';
import hashService from '../auth/utils/hash'
import { Public } from 'src/auth/utils/custo.deco';
import { UsersService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { IdDto, NameDto } from './dto/user.dto';

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
	async changeUserName(@Req() req, @Body() nameDto: NameDto) {
		const user = req.user;
		await this.userservice.changeName(user.id, nameDto.username);
		console.log(nameDto);
		
		return nameDto.username
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

	// @Get('/avatar:filename')
	// serveAvatar(@Param('filename') filename: string, @Res() res: Response) {
	// 	// console.log('looking for  ', filename);
	// 	return res.sendFile(filename, { root: join(__dirname, '../..', 'avatar') });
	// }

	@Get('/ava:id')
	async serveAvatarById(@Param('id', ParseIntPipe) id, @Res() res: Response) {
		const img_name = await this.userservice.myAvatar(id);
		if (img_name === "placeholder")
			return res.status(204).send(null);
		try {
			const imagePath = path.resolve("/app/avatar", img_name)
			return res.sendFile(imagePath);
		} catch {
			throw new BadRequestException("error in find img path");
		}
	}

	@Get('/myavatar')
	async serveMyAvatar(@Req() req, @Res() res: Response) {
		const img_name = await this.userservice.myAvatar(req.user.id)
		if (img_name === "placeholder") {
			return res.status(204).send(null);
		}
		try {
			const imagePath = path.resolve("/app/avatar", img_name);
			return res.sendFile(imagePath);
		} catch {
			throw new BadRequestException("error in find img path");
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

	@Get('/stats:id')
	async userstats(@Req() req, @Param('id', ParseIntPipe) id){
		let stats = new StatsDto();
		let usedId;
		if (id)
			usedId = id;
		else
			usedId = req.user.id

		let db_stats = await this.userservice.dbStats(usedId);
		const friends: number[] = db_stats.friends;
		
		stats = {...db_stats};
		
		stats.level = this.userservice.calcLevel(stats.win, stats.lose);
		if (stats.level > 5)
		{
			await this.userservice.updateAchivement(1, usedId);
			stats.success_one = true;
		}
		if (friends.length > 0)
		{
			this.userservice.updateAchivement(2, usedId);
			stats.success_two = true;
		}
		if (stats.win + stats.lose >= 10)
		{
			await this.userservice.updateAchivement(3, usedId);
			stats.success_three = true;
		}

		return(stats)
	}

	@Get('/stats')
	async userstatsPerso(@Req() req){
		let stats = new StatsDto();
		let usedId = req.user.id
		let db_stats = await this.userservice.dbStats(usedId);
		const friends: number[] = db_stats.friends;
		
		stats = {...db_stats};
		
		stats.level = this.userservice.calcLevel(stats.win, stats.lose);
		if (stats.level > 5)
		{
			await this.userservice.updateAchivement(1, usedId);
			stats.success_one = true;
		}
		if (friends.length > 0)
		{
			this.userservice.updateAchivement(2, usedId);
			stats.success_two = true;
		}
		if (stats.win + stats.lose >= 10)
		{
			await this.userservice.updateAchivement(3, usedId);
			stats.success_three = true;
		}

		return(stats)
	}

	@Get('/friends')
	async userfriends(@Req() req){
		let friends = await this.userservice.getAllFriends(req.user.id);
		return(friends)
	}

	@Get('/everyone')
	async users(@Req() req){
		let users = await this.userservice.getAllUsers();
		return(users)
	}

	@Patch('/addfriend')
	async addfriend(@Req() req, @Body() IdFriend: IdDto){
		await this.userservice.addFriend(req.user.id, IdFriend.id)
		return {msg: "friend added"}
	}

	@Get('/everyone/filter')
	async usersFilter(@Req() req){
		let users = await this.userservice.getAllUsersFilter(req.user.id);
		return(users)
	}

	@Get('/matchs:id')
	async userMatchs(@Req() req, @Param('id', ParseIntPipe) id){
		if (id === 0)
			id = req.user.id;
		if (id === 0)
			id = req.user.id;
		let users = await this.userservice.getMatchs(id);
		return(users)
	}
}
