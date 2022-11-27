import { Inject, Injectable } from '@nestjs/common';
import { IConfiguration } from '../../shares/interfaces/config/configuration.interface';
import { CONFIG_OPTIONS } from '../../shares/constants/constant';
import { IConfigOption } from '../../shares/interfaces/config/config-option.interface';
import dotenv from 'dotenv';
import { IAuthConfiguration } from '../../shares/interfaces/config/auth-configuration.interface';
import path from 'path';
import fs from 'fs';
import { isNullOrUndefined } from '../../shares/helpers/utils';
import { RequiredConfigurationNotFoundError } from '../../shares/exceptions/config.exception';
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

  getMongoUri(): string {
    // If mongodb uri is provided, use it
    const mongodbConfig = this.configuration.mongodb;
    if (!isNullOrUndefined(mongodbConfig.uri)) {
      return this.configuration.mongodb.uri;
    }

    // Else, calculate it
    if ([mongodbConfig.host, mongodbConfig.port, mongodbConfig.database].some((x) => isNullOrUndefined(x))) {
      throw new RequiredConfigurationNotFoundError(['host', 'port', 'database']);
    }
    let uri = 'mongodb://';
    if (!isNullOrUndefined([mongodbConfig.username, mongodbConfig.password])) {
      uri = uri + `${mongodbConfig.username}:${mongodbConfig.password}@`;
    }
    uri = uri + `${mongodbConfig.host}:${mongodbConfig.port}/${mongodbConfig.database}?`;
    if (!isNullOrUndefined([mongodbConfig.replset])) {
      uri = uri + `authSource=admin&replicaSet=${mongodbConfig.replset}&retryWrites=true&w=majority`;
    }
    this.configuration.mongodb.uri = uri;
    return uri;
  }

  getEnvironment(): string {
    return process.env.APP_ENV;
  }
}
