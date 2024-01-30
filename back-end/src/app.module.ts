import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyGateway } from './chat/chat.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

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
export class AppModule {}
