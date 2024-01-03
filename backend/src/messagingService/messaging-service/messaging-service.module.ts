import { Module } from '@nestjs/common';
import { MessagingServiceController } from './messaging-service.controller';

@Module({
  controllers: [MessagingServiceController]
})
export class MessagingServiceModule {}
