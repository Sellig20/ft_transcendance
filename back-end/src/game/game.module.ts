import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UsersService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
  imports: [UserModule]
})
export class GameModule {}
