import { IAuthConfiguration } from './auth-configuration.interface';
import { IMongoConfiguration } from './mongodb-configuration.interface';
import { ILoggerConfiguration } from './logger-configuration.interface';
import { IRedisConfiguration } from './redis-configuration.interface';

export interface IConfiguration {
  auth: IAuthConfiguration;
  mongodb: IMongoConfiguration;
  logger: ILoggerConfiguration;
  redis: IRedisConfiguration;
}
