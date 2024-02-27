import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { gatewayPong } from './game.gateway';

@Module({
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
