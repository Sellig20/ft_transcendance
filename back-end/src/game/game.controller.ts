import { Body, Controller, Get, Post, Req, Res, Patch, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Param, ParseIntPipe, BadRequestException, HttpCode } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { GameOverDTO } from './dto/game.dto';
import { GameService } from './game.service';

@Controller('/game/stats')
export class GameController {
	constructor(
		private userservice: UsersService,
		private gameservice: GameService
		) { }

	@Post('/saveMatch')
	async saveMatchs(@Req() req,@Body() data: GameOverDTO ){
		await this.gameservice.saveMatch(data.winnerId, data.losserId)
	}

	@Post('/gomeover')
	async userMatchs(@Req() req,@Body() data: GameOverDTO ){
		//update les joueur : nb win/lose et le elo


		if (req.user.id === data.winnerId) {

		}
		else {

		}
	}
}
