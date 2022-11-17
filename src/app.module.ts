import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './modules/config/config.module';

@Module({
  imports: [AuthModule, ConfigModule.register({ folder: 'configuration' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
