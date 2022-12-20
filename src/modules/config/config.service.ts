import { Inject, Injectable } from '@nestjs/common';
import { IConfiguration } from '../../shares/interfaces/config/configuration.interface';
import { CONFIG_OPTIONS } from '../../shares/constants/constant';
import { IConfigOption } from '../../shares/interfaces/config/config-option.interface';
import dotenv from 'dotenv';
import { IAuthConfiguration } from '../../shares/interfaces/config/auth-configuration.interface';
import path from 'path';
import fs from 'fs';
import { isNullOrUndefined, isSomeValueNullOrUndefined } from '../../shares/helpers/utils';
import { RequiredConfigurationNotFoundError } from '../../shares/exceptions/config.exception';
import { IMongoConfiguration } from '../../shares/interfaces/config/mongodb-configuration.interface';
import { ILoggerConfiguration } from '../../shares/interfaces/config/logger-configuration.interface';
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

  getMongoConfiguration(): IMongoConfiguration {
    return this.configuration.mongodb;
  }

  getMongoUri(): string {
    // If mongodb uri is provided, use it
    const mongodbConfig = this.configuration.mongodb;
    if (!isNullOrUndefined(mongodbConfig.uri)) {
      return this.configuration.mongodb.uri;
    }

    // Else, calculate it
    if (isSomeValueNullOrUndefined([mongodbConfig.host, mongodbConfig.port, mongodbConfig.database])) {
      throw new RequiredConfigurationNotFoundError(['host', 'port', 'database']);
    }
    let uri = 'mongodb://';
    if (!isSomeValueNullOrUndefined([mongodbConfig.username, mongodbConfig.password])) {
      uri = uri + `${mongodbConfig.username}:${mongodbConfig.password}@`;
    }
    uri = uri + `${mongodbConfig.host}:${mongodbConfig.port}/${mongodbConfig.database}?`;
    if (!isSomeValueNullOrUndefined([mongodbConfig.replset])) {
      uri = uri + `authSource=admin&replicaSet=${mongodbConfig.replset}&retryWrites=true&w=majority`;
    }
    this.configuration.mongodb.uri = uri;
    return uri;
  }

  getEnvironment(): string {
    return process.env.APP_ENV;
  }

  getLoggerConfiguration(): ILoggerConfiguration {
    return this.configuration.logger;
  }
}
