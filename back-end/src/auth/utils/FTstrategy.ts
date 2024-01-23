import { Injectable, PayloadTooLargeException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class FTstrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private prisma: PrismaService,
    private userService: UsersService,
  ) {
    super({
      clientID: config.get('FT_API_CLIENT_ID'),
      clientSecret: config.get('FT_API_SECRET'),
      callbackURL: 'http://localhost:8000/auth/42-redirect',
      Scope: ['profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    let user = await this.prisma.user.findFirst({
      where: {
        username: profile.username,
      },
    });
    if (!user) {
      await this.prisma.user.create({
        data: {
          email: profile.emails[0].value,
          username: profile.username,
          TFA_secret_hash: null,
          TFA_activated: false,
        },
      });
      user = await this.userService.findUserByMail(profile.emails[0].value);
    }
    return user;
  }
}
