import { Inject, Injectable } from '@nestjs/common';
import { IConfiguration } from '../../shares/interfaces/config/configuration.interface';
import { CONFIG_OPTIONS } from '../../shares/constants/constant';
import { IConfigOption } from '../../shares/interfaces/config/config-option.interface';
import dotenv from 'dotenv';
import { IAuthConfiguration } from '../../shares/interfaces/config/auth-configuration.interface';
import path from 'path';
import fs from 'fs';
dotenv.config();

@Injectable()
export class ConfigService {
  private readonly configuration: IConfiguration;

  constructor(@Inject(CONFIG_OPTIONS) options: IConfigOption) {
    const envFile = `${process.env.APP_ENV || 'local'}.json`;
    const envFilePath = path.resolve(__dirname, options.folder, envFile);
    const data = JSON.parse(fs.readFileSync(envFilePath, 'utf-8'));
    this.configuration = data;
  }

  getAuthConfiguration(): IAuthConfiguration {
    return this.configuration.auth;
  }

  getEnvironment(): string {
    return process.env.APP_ENV;
  }
}
