import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserUnauthorizedException } from '../../../shares/exceptions/auth.exception';
import { PublicUserInfoResponseDto } from '../../users/dto/public-user-info.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<PublicUserInfoResponseDto> {
    const user = await this.authService.validateUserWithEmailAndPassword(email, password);
    if (!user) throw new UserUnauthorizedException(`Username and password not correct`);
    return plainToInstance(PublicUserInfoResponseDto, user);
  }
}
