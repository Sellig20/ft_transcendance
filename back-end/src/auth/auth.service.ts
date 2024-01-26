import { Injectable } from '@nestjs/common';
import { UserDetails } from './dto';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { UsersService } from 'src/user/user.service';
import { toDataURL } from 'qrcode'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userservice: UsersService
	) { }

	//peut etre a changer d'endroit ?? c'est une methode de userservice ça 


	async signin(user: any) {
		const payload = { 
			username: user.username,
			sub: user.id,
			TFA_activated: false,
			isTFAauth: false
		};
		return {
			access_token: this.jwt.sign(payload),
		};
	}

	async signinTFA(user: any) {
		const payload = {
			username: user.username,
			sub: user.id,
			TFA_activated: true,
			isTFAauth: true,
		}
		return {
			access_token: this.jwt.sign(payload),
		};
	}

	async TfaSecretGen(user: any) {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri('test', 'trans', secret);
		// console.log('in tfgen secret \n : --------------------------', user);
		await this.userservice.setTfaSecret(user.id, secret);

		return otpauthUrl;
	}

	async generateQrcodeDataUrl(otpauthUrl: string) {
		return toDataURL(otpauthUrl);
	}

	async isTFAvalid(TFAcode: string, userId: number) {
		const user = await this.userservice.findUserId(userId)
		return authenticator.verify({
			token: TFAcode,
			secret: user.TFA_secret_hash,
		});
	}
	//   readToken(token: { access_token: string }) {
	//     return this.jwt.decode(token.access_token);
	//   }

}
