import { ConfigService } from './config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CONFIG_OPTIONS } from '../../shares/constants/constant';
import { IConfigOption } from '../../shares/interfaces/config/config-option.interface';
import path from 'path';
import { options } from 'tsconfig-paths/lib/options';
import { IConfiguration } from '../../shares/interfaces/config/configuration.interface';
import fs from 'fs';
import { IMongoConfiguration } from '../../shares/interfaces/config/mongodb-configuration.interface';
import { getRandomValue } from '../../shares/helpers/utils';
import { RequiredConfigurationNotFoundError } from '../../shares/exceptions/config.exception';

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

  describe(`Test calculating mongoURI`, () => {
    let mongoConfig: IMongoConfiguration;
    beforeEach(() => {
      mongoConfig = service.getMongoConfiguration();
    });

    it(`Update configuration in mem success`, () => {
      const testUri = `uri-test`;
      mongoConfig.uri = testUri;
      expect(service.getMongoUri()).toEqual(testUri);
    });

    it(`Throw error when one of required value not provided`, () => {
      const requiredField = ['host', 'port', 'database'][getRandomValue(0, 3)];
      mongoConfig[requiredField] = null;
      console.log(mongoConfig);
      expect(() => service.getMongoUri()).toThrowError(RequiredConfigurationNotFoundError);
    });
  });
});
