import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { IUserInfo } from '../user-info.interface';
import { AuthService } from '../auth.service';
import { UserUnauthorizedException } from '../../../shares/exceptions/auth.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<IUserInfo> {
    const user = await this.authService.validateUserWithUsernameAndPassword(username, password);
    if (!user) throw new UserUnauthorizedException(`Email and password not correct`);
    return user;
  }
}
