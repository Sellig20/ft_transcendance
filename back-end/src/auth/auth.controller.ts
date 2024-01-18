import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard } from './FTGuard';

@Controller('auth')
export class AuthController {
	constructor() { }

	@UseGuards(FTGuard)
	@Get('42')
	auth42() {}

	@UseGuards(FTGuard)
	@Get('42-redirect')
	auth42Redirect(@Req() req) {
		return {msg: 'bismilah ' + req.user}
	}
}
