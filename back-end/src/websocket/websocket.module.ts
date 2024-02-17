import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  providers: [WebsocketService, WebsocketGateway]
})
export class WebsocketModule {}


// @Module({
//   imports: [PrismaModule, forwardRef(() => GameModule), JwtModule.register({})],
//   providers: [WebsocketGateway, WebsocketsService],
//   exports: [WebsocketsService],
// })