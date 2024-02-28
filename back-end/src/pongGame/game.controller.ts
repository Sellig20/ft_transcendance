import { Controller, Get, Post, Req, Res, Param, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game.service';
import { GameOverDTO } from './dto';
import { UsersService } from 'src/user/user.service';

@Controller('game')
export class GameController {
	constructor(
		private prisma: PrismaService,
		private userservice: UsersService,
		private gameservice: GameService
	) { }

	@Post('/saveMatch')
	async saveMatchs(@Req() req,@Body() data: GameOverDTO ){
		await this.gameservice.saveMatch(data.winnerId, data.losserId)
	}

	@Post('/gomeOver')
	async userMatchs(@Req() req,@Body() data: GameOverDTO ){
		let win;
		if (req.user.id === data.winnerId)
			win = true;
		else 
			win = false;
		const elo = this.gameservice.calcElo(data.winnerId, data.losserId, win)
		await this.gameservice.updateUserInfo(req.user.id, win, elo);
	}
}
