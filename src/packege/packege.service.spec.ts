import { Test, TestingModule } from '@nestjs/testing';
import { PackegeService } from './packege.service';

describe('PackegeService', () => {
  let service: PackegeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackegeService],
    }).compile();

    service = module.get<PackegeService>(PackegeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
