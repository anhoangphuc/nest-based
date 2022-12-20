import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './modules/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './modules/config/config.service';
import { UsersModule } from './modules/users/users.module';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { createTransports, enumerateErrorFormat, timestamp } from './shares/helpers/logger';

@Module({
  imports: [
    AuthModule,
    ConfigModule.register({ folder: 'configuration' }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
