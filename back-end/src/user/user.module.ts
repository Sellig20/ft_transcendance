import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [ 
    MulterModule.register({
    dest: './avatar'
    }),]
})
export class UserModule {}
