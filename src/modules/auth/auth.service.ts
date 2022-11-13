import { Injectable } from '@nestjs/common';
import { IUserInfo } from './user-info.interface';

@Injectable()
export class AuthService {
  async validateUserWithUsernameAndPassword(username: string, password: string): Promise<IUserInfo> {
    if (username === 'hoangphucnb97@gmail.com' && password === '1') {
      return { username, password };
    }
    return null;
  }
}
