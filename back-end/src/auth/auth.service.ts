import { Injectable } from '@nestjs/common';
import { UserDetails } from './dto';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { UsersService } from 'src/user/user.service';
import { toDataURL } from 'qrcode'
import encryptService from '../auth/utils/hash'

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
			isTFAauth: false,
			id: user.id,
		};
		return {
			access_token: this.jwt.sign(payload),
		};
	}

	async signinTFA(user: any) {
		// console.log('user in tfa signin: ', user);
		
		const payload = {
			username: user.username,
			sub: user.id,
			TFA_activated: true,
			isTFAauth: true,
		}
		// console.log('payload to be sent: ', payload);
		
		return {
			access_token: this.jwt.sign(payload),
		};
	}

	async TfaSecretGen(user: any) {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri('test', 'trans', secret);
		const hash = encryptService.hash(secret);
		await this.userservice.setTfaSecret(user.id, hash);

		return otpauthUrl;
	}

	async generateQrcodeDataUrl(otpauthUrl: string) {
		return toDataURL(otpauthUrl);
	}

	async isTFAvalid(TFAcode: string, userId: number) {
		const user = await this.userservice.findUserId(userId)
		const decrypte = encryptService.decipher(user.TFA_secret_hash);
		return authenticator.verify({
			token: TFAcode,
			secret: decrypte,
		});
	}
	//   readToken(token: { access_token: string }) {
	//     return this.jwt.decode(token.access_token);
	//   }

}
