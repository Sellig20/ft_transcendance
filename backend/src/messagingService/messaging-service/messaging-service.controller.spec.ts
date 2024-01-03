import { Test, TestingModule } from '@nestjs/testing';
import { MessagingServiceController } from './messaging-service.controller';

describe('MessagingServiceController', () => {
  let controller: MessagingServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagingServiceController],
    }).compile();

    controller = module.get<MessagingServiceController>(MessagingServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
