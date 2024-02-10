import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../utils/custo.deco';

@Injectable()
export class Jwt2faAuthGuard extends AuthGuard('jwt2') {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}
		return super.canActivate(context);
	}

	// handleRequest(
	// 	err: any,
	// 	user: any,
	// 	info: any,
	// 	context: ExecutionContext,
	// 	status?: any,
	// ) {
	// 	if (err || !user) {
	// 		throw err || new UnauthorizedException("jwt authguard error");
	// 	}
	// 	return user;
	// }
}