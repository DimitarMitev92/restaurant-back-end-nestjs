import { Test, TestingModule } from '@nestjs/testing';
import { PackegeController } from './packege.controller';
import { PackegeService } from './packege.service';

describe('PackegeController', () => {
  let controller: PackegeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackegeController],
      providers: [PackegeService],
    }).compile();

    controller = module.get<PackegeController>(PackegeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
