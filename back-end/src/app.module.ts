import { Module } from '@nestjs/common';
import { MyGateway } from './chat/chat.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MyGateway],
})
export class AppModule {}
