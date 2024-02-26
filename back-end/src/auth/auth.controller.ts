import { Body, Controller, Get, Post, Res, Req, UnauthorizedException, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard } from './guard/FTGuard';
import { Public } from './utils/custo.deco';
import { UsersService } from 'src/user/user.service';
import { JWTAUthGuard } from './guard/JWTGuard'
import { log } from 'console';
import { jwtConstants } from './utils/constant';

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
		// console.log('hello went through the redirect :)');
		const url = new URL(`http://${jwtConstants.host_id}:8080/auth`);
		// console.log('in this ft guard', req.user);
		if (req.user.TFA_activated) {
			url.searchParams.append('tfa', 'ON');
			url.searchParams.append('code', 'none');
			url.searchParams.append('userId', req.user.id);
		}
		else {
			url.searchParams.append('tfa', 'OFF');
			const token = await this.authService.signin(req.user);
			await this.userService.changeStatus(req.user.id, "online");
			url.searchParams.append('code', token.access_token);
		} 
		return res.redirect(url.href);
	}

	
	@Get('2fa/generate')
	async generate(@Req() req){
		const otpUrl = await this.authService.TfaSecretGen(req.user)
		const img = await this.authService.generateQrcodeDataUrl(otpUrl);
		return (img)
	}

	@Post('2fa/turn-on')
	async turnOnTfa(@Req() req, @Body() body) {

		const isCodeValid = await this.authService.isTFAvalid(
			body.TFACode,
			req.user.id
		)
		if (!isCodeValid) {
			throw new BadRequestException('Wrong authentification code');
		}
		await this.userService.setTfaOn(req.user.id)
		return ({ msg: '2FA ON' })
	}

	@Get('2fa/off')
	async turnOffTfa(@Req() req) {
		console.log(req.user);
		await this.userService.setTfaOff(req.user.id);
		await this.userService.setTfaSecret(req.user.id, "")
		const token = await this.authService.signin(req.user);

		return token;
	}

	@Public()
	@Post('2fa/authenticate')
	async authenticate(@Req() req, @Body() body) {
		try {
			// console.log(body.idFront, typeof body.idFront);
			const isCodeValid = await this.authService.isTFAvalid(
				body.TFACode,
				body.idFront
			)
			if (!isCodeValid) {
				throw new UnauthorizedException('Wrong authentification code');
			}
			const user = await this.userService.findUserId(body.idFront)
			await this.userService.changeStatus(user.id, "online");
			return await this.authService.signinTFA(user);
		} catch {
			throw new BadRequestException('Wrong authentification code');
		}

	}

	@Get('login')
	salope(@Req() req) {
		return req.user;
	}
}
