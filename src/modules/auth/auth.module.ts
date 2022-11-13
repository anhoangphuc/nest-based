import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtExpireTime, JwtSecretKey } from '../../shares/constants/auth.constant';

@Module({
  imports: [
    JwtModule.register({
      secret: JwtSecretKey,
      signOptions: { expiresIn: JwtExpireTime },
    }),
  ],
  providers: [LocalStrategy, AuthService],
})
export class AuthModule {}
