import { Controller, Get, Post, Req, Res, Param, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game.service';


@Controller('game')
export class GameController {
	constructor(
		private prisma: PrismaService,
		private GameService: GameService
	) { }

}
