import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';

export class VerifyTokenStrategy extends PassportStrategy(Strategy, 'verify-token') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getAuthConfiguration().verifyToken.secretKey,
    });
  }

  async validate(payload: any) {
    return { email: payload.email };
  }
}
