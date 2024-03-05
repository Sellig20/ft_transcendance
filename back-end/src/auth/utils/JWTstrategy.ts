import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constant';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class JWTstrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: true, //a changer en false pour reelle utilisation
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {

	const user = await this.userService.findUserId(payload.id);
	if (user.TFA_activated)
		payload.TFA_activated = true;
	
    // console.log('In JWT strat \n', payload);
	return {...payload, id: payload.sub};
  }
}
