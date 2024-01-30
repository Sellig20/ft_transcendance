import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoggingMiddleware } from './logger/loggerBasic';

@Module({
  controllers: [],
  providers: [MyGateway],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
  ],
})

export class AppModule implements NestModule{
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggingMiddleware)
			.forRoutes('*')
	}
}
