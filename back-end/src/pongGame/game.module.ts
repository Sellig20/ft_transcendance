import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { gatewayPong } from './game.gateway';
import { UserModule } from 'src/user/user.module';
import { UsersService } from 'src/user/user.service';

@Module({
  controllers: [GameController],
  providers: [GameService, UsersService],
  exports: [GameService, UsersService],
  imports: [UserModule]
})
export class GameModule {}
