import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UsersService } from 'src/user/user.service';

@Module({
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
  imports: [UsersService]
})
export class GameModule {}
