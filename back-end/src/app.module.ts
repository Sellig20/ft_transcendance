import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [ConfigModule.forRoot({
		isGlobal: true,
		ignoreEnvFile: true
	}), AuthModule, PrismaModule, UserModule],

})
export class AppModule {}
