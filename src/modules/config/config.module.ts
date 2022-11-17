import { DynamicModule, Module } from '@nestjs/common';
import { IConfigOption } from '../../shares/interfaces/config/config-option.interface';
import { CONFIG_OPTIONS } from '../../shares/constants/constant';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  static register(options: IConfigOption): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
