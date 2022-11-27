import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './modules/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './modules/config/config.service';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
