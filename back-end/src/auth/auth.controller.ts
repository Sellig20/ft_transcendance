import { Body, Controller, Get, Post, Res, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
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
	@UseGuards(FTGuard)
	@Get('42')
	auth42() { }

	@Public()
	@UseGuards(FTGuard)
	@Get('42-redirect')
	async auth42Redirect(@Req() req, @Res() res) {
		console.log('hello went through the redirect :) ');
		const url = new URL('http://localhost:80/auth')
		const token = await this.authService.signin(req.user);
		url.searchParams.append('code', token.access_token)
		return res.redirect(url.href)
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
