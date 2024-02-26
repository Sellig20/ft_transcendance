import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService)
	app.enableCors({
		origin: true,
		//   origin: configService.get('FRONTEND_URL'),
		credentials: true,
	})
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		transform: true,
	}));
	app.use(passport.initialize());
	await app.listen(8000);
}
bootstrap();
