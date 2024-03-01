import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoggingMiddleware } from './logger/loggerBasic';
import { MyGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { gatewayPong } from './pongGame/game.gateway';
import { GameModule } from './pongGame/game.module';
@Module({
  controllers: [],
  providers: [MyGateway, gatewayPong],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    ChatModule,
    GameModule,
  ],
})

export class AppModule implements NestModule{
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggingMiddleware)
			.forRoutes('*')
	}
}
