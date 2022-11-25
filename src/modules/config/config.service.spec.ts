import { ConfigService } from './config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CONFIG_OPTIONS } from '../../shares/constants/constant';

describe(`Config service`, () => {
  let service: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: { folder: './configuration' },
        },
        ConfigService,
      ],
    }).compile();
    service = moduleRef.get<ConfigService>(ConfigService);
  });

  it(`Should be defined`, () => {
    expect(service).toBeDefined();
  });
});
