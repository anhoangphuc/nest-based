import { IAuthConfiguration } from './auth-configuration.interface';
import { IMongoConfiguration } from './mongodb-configuration.interface';

export interface IConfiguration {
  auth: IAuthConfiguration;
  mongodb: IMongoConfiguration;
}
