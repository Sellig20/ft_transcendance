import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard } from './guard/FTGuard';
import { Public } from './utils/custo.deco';
import { UsersService } from 'src/user/user.service';
import { JWTAUthGuard } from './guard/JWTGuard'

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UsersService) { }

	@Public()
	// @UseGuards(FTGuard)
	@Get('42')
	auth42() { }

	@Public()
	// @UseGuards(FTGuard)
	@Get('42-redirect')
	auth42Redirect(@Req() req) {
		console.log('hello went through the redirect :) ');
		return this.authService.signin(req.user);
	}

	
	@Get('2fa/generate')
	async generate(@Req() req){
		const otpUrl = await this.authService.TfaSecretGen(req.user)
		const img = await this.authService.generateQrcodeDataUrl(otpUrl);
		return (`<img src="${img}" alt="QR Code" />`)
	}

	@Post('2fa/turn-on')
	async turnOnTfa(@Req() req, @Body() body) {
		const isCodeValid = await this.authService.isTFAvalid(
			body.TFACode,
			req.user.id
		)
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentification code');
		}
		await this.userService.setTfaOn(req.user.id)
		// console.log( await this.userService.findUserId(req.user.userId));
		return ({ msg: '2FA ON' })
	}

	@Public()
	@UseGuards(JWTAUthGuard)
	@Post('2fa/authenticate')
	async authenticate(@Req() req, @Body() body) {
		const isCodeValid = await this.authService.isTFAvalid(
			body.TFACode,
			req.user.id
			)
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentification code');
		}
		return await this.authService.signinTFA(req.user);
	}

	@Get('login')
	salope(@Req() req) {
		return req.user;
	}
}
