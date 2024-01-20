import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard } from './guard/FTGuard';
import { Public } from './utils/custo.deco';


@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Public()
	@UseGuards(FTGuard)
	@Get('42')
	auth42() {}


	@Public()
	@UseGuards(FTGuard)
	@Get('42-redirect')
	auth42Redirect(@Req() req) {
		console.log('hello went through the redirect :) ');
		return this.authService.signin(req.user)
	}

	@Get('login')
	salope(@Req() req) {
		return req.user
	}
	
}
