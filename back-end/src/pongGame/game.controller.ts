import { Controller, Get, Post, Req, Res, Param, Body, ParseIntPipe } from '@nestjs/common';
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
	async saveMatchs(data: GameOverDTO) {

		await this.gameservice.saveMatch(data.winnerId, data.loserId);
		const elo_win = await this.gameservice.calcElo(data.winnerId, data.loserId, true);
		const elo_lose = await this.gameservice.calcElo(data.loserId, data.winnerId, false);

		await this.gameservice.updateUserInfo(data.winnerId, true, elo_win);
		await this.gameservice.updateUserInfo(data.loserId, false, elo_lose);

	}
}
