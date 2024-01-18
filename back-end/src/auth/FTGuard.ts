import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class FTGuard extends AuthGuard('42') {
	async canActivate(context: ExecutionContext){
		try {
			const activate = (await super.canActivate(context)) as boolean;
			const request = context.switchToHttp().getRequest();
			await super.logIn(request);
			return activate;
		} catch (error) {
			console.log(error);
		}
	}
}
