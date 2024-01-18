import { Injectable, PayloadTooLargeException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto";

@Injectable()
export class FTstrategy extends PassportStrategy(Strategy, '42') {
	constructor (
		private authService: AuthService,
		private config: ConfigService,
		private prisma: PrismaService
	) {
		super({
			clientID: "u-s4t2ud-1443577288bc8a71b0f2fd669f03823010304a73652042104f98881aa485a5f0",
			clientSecret: "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",
			callbackURL: "http://localhost:8000/auth/42-redirect",
			Scope: ['profile']
		});
	}
	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		console.log(accessToken);
		
		let user = await this.prisma.user.findFirst({
			where: {
				username: profile.username,
			},
		})
		if(!user){
			await this.prisma.user.create({
				data: {
					email: 'profile.email',
					username: profile.username,
					hash: 'test',
				},
			});
			user = await this.authService.findUser(profile.emails[0].value);
		}
		return user;
	}
}