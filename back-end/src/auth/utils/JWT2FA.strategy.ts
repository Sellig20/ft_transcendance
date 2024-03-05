import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/user/user.service";
import { jwtConstants } from './constant'

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt2') {
	constructor(private readonly userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			// ignoreExpiration: true, //a changer en false pour reelle utilisation
			secretOrKey: jwtConstants.secret,
		});
  }

	async validate(payload: any) {
		// console.log('we are in jwt 2fa strat', payload);


		const user = await this.userService.findUserId(payload.id);
		if (!user)
			throw new UnauthorizedException("jwt authguard error");
		if (!user.TFA_activated) {
			return { ...payload, id: payload.sub };
		}
		if (payload.isTFAauth) {
			return { ...payload, id: payload.sub };
		}
	}
}