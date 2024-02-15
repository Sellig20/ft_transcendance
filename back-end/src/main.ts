import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService)
	app.enableCors({
		origin: true,
		//   origin: configService.get('FRONTEND_URL'),
		credentials: true,
	})
	app.use(passport.initialize());
	await app.listen(8000);
}
bootstrap();
