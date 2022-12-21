import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './modules/core/config.service';
import { UsersModule } from './modules/users/users.module';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { createTransports, enumerateErrorFormat, timestamp } from './shares/helpers/logger';
import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';
import { AccountSignatureModule } from './modules/account-signature/account-signature.module';

@Module({
  imports: [
    AuthModule,
    CoreModule.register({ folder: 'configuration' }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.getMongoUri(),
        };
      },
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const transports = createTransports(
          configService.getLoggerConfiguration().useFile,
          configService.getAppName(),
          configService.getEnvironment(),
        );
        return {
          level: 'info',
          format: winston.format.combine(timestamp(), enumerateErrorFormat()),
          transports,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AccountSignatureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
