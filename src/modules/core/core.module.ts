import { DynamicModule, Global, Module } from '@nestjs/common';
import { IConfigOption } from '../../shares/interfaces/config/config-option.interface';
import { CONFIG_OPTIONS } from '../../shares/constants/constant';
import { ConfigService } from './config.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Global()
@Module({})
export class CoreModule {
  static register(options: IConfigOption): DynamicModule {
    return {
      module: CoreModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      imports: [
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.getAuthConfiguration().jwt.secretKey,
            signOptions: {
              expiresIn: configService.getAuthConfiguration().jwt.expireTime,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      exports: [ConfigService, JwtModule],
    };
  }
}
