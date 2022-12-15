import { Injectable } from '@nestjs/common';
import { IUserInfo } from './user-info.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async validateUserWithUsernameAndPassword(email: string, password: string): Promise<IUserInfo> {
    if (email === 'hoangphucnb97@gmail.com' && password === '1') {
      return { email };
    }
    return null;
  }

  async login(user: IUserInfo) {
    const payload = { email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async updatePassword(user: IUserInfo) {
    console.log(`Update password of user ${user.email}`);
  }
}
