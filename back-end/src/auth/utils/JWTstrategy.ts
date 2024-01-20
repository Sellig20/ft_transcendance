import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwtConstants  } from "./constant";

@Injectable()
export class JWTstrategy extends PassportStrategy(Strategy) {
	constructor() {
	super ({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		ignoreExpiration: false,
		secretOrKey: jwtConstants.secret
	});
	}

	async validate(payload: any) {
		console.log(payload);
		return {userId: payload.sub, username: payload.username};
	}
}