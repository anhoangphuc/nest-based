import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  providers: [LocalStrategy],
})
export class AuthModule {}
