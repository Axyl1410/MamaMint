import { Test, TestingModule } from '@nestjs/testing';
import { CaptureController } from './capture.controller';

describe('CaptureController', () => {
  let controller: CaptureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaptureController],
    }).compile();

    controller = module.get<CaptureController>(CaptureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
