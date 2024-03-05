import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FTGuard } from './guard/FTGuard';
import { FTstrategy } from './utils/FTstrategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './utils/constant';
import { JWTstrategy } from './utils/JWTstrategy';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from 'src/user/user.module';
import { Jwt2faAuthGuard } from './guard/JWTTFAauth.guard'
import { Jwt2faStrategy } from './utils/JWT2FA.strategy';
import { JWTAUthGuard } from './guard/JWTGuard';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
	UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FTGuard,
	JWTAUthGuard,
    FTstrategy,
    JWTstrategy,
	Jwt2faStrategy,
    {
      provide: APP_GUARD,
      useClass: Jwt2faAuthGuard,
    },
  ],
})
export class AuthModule {}
