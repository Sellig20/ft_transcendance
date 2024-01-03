import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ForbiddenException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
 
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    ){}

  async signup(dto: AuthDto){ 
    //generate the password hash
    // save the new user in the db
    const hash = await argon.hash(dto.password)
    try {
        const user = await this.prisma.user.create({
          data: {
            email: dto.email,
            hash,
          },
        });
        return this.signToken(user.id, user.email);
    }
    catch(error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') //code de duplicate field dans PRISMA
        {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
    
    //return the saved user 
  }

  async signin(dto: AuthDto) {


    //find the user by email
    const user = 
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    //if user doesnt exist => error
      if (!user) throw new ForbiddenException(
        'Credentials incorrect',
      );
      
      //compare password
      const pwMatches = await argon.verify(
        user.hash, 
        dto.password,
      );

      //password incorrect => error
      if (!pwMatches)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    //send back user if everything correct
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number, 
    email: string,
    ): Promise<{ access_token: string }> {

        const payload = {
          sub: userId,
          email,
        };
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
          payload,
          {
            expiresIn: '15m',
            secret: secret,
          },
        );

        return {
          access_token: token,
        };
    }
}
