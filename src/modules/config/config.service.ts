import { Inject, Injectable } from '@nestjs/common';
import { IConfiguration } from '../../shares/interfaces/config/configuration.interface';
import { CONFIG_OPTIONS } from '../../shares/constants/constant';
import { IConfigOption } from '../../shares/interfaces/config/config-option.interface';
import dotenv from 'dotenv';
import local from './configuration/local.json';
import test from './configuration/test.json';
import { IAuthConfiguration } from '../../shares/interfaces/config/auth-configuration.interface';
dotenv.config();

@Injectable()
export class ConfigService {
  private readonly configuration: IConfiguration;

  private readonly envs = { test, local };

  constructor(@Inject(CONFIG_OPTIONS) options: IConfigOption) {
    const env = `${process.env.APP_ENV || 'local'}`;
    this.configuration = this.envs[env];
  }

  getAuthConfiguration(): IAuthConfiguration {
    return this.configuration.auth;
  }
}
