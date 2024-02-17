import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoggingMiddleware } from './logger/loggerBasic';
import { MyGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { gatewayPong } from './pongGame/game.gateway';
import { GameModule } from './pongGame/game.module';
import { join } from 'path';
import { WebsocketModule } from './websocket/websocket.module';

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
    WebsocketModule,
  ],
})

export class AppModule implements NestModule{
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggingMiddleware)
			.forRoutes('*')
	}
}
