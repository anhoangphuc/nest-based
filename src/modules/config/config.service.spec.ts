import { ConfigService } from './config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CONFIG_OPTIONS } from '../../shares/constants/constant';
import { IConfigOption } from '../../shares/interfaces/config/config-option.interface';
import path from 'path';
import { options } from 'tsconfig-paths/lib/options';
import { IConfiguration } from '../../shares/interfaces/config/configuration.interface';
import fs from 'fs';

describe(`Config service`, () => {
  let service: ConfigService;
  const option: IConfigOption = { folder: './configuration' };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: option,
        },
        ConfigService,
      ],
    }).compile();
    service = moduleRef.get<ConfigService>(ConfigService);
  });

  it(`Should be defined`, () => {
    expect(service).toBeDefined();
  });

  it(`Environment should be define`, () => {
    expect(['test', 'local']).toContain(service.getEnvironment());
  });

  describe(`Test value`, () => {
    let configuration: IConfiguration;
    beforeEach(() => {
      const envFilePath = path.resolve(__dirname, option.folder, `${service.getEnvironment()}.json`);
      configuration = JSON.parse(fs.readFileSync(envFilePath, 'utf-8'));
    });

    it(`Test auth`, () => {
      expect(service.getAuthConfiguration().jwt.secretKey).toEqual(configuration['auth']['jwt']['secretKey']);
    });
  });
});
