import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';

@Module({
  providers: [LocalStrategy, AuthService],
})
export class AuthModule {}
