import { Injectable } from '@nestjs/common';
import { IUserInfo } from './user-info.interface';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async validateUserWithUsernameAndPassword(username: string, password: string): Promise<IUserInfo> {
    if (username === 'hoangphucnb97@gmail.com' && password === '1') {
      return { username };
    }
    return null;
  }

  async login(user: IUserInfo) {
    const payload = { username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async updatePassword(user: IUserInfo) {
    console.log(`Update password of user ${user.username}`);
  }
}
