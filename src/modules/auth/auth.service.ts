import { Injectable } from '@nestjs/common';
import { IUserInfo } from './user-info.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersDocument } from '../users/schema/users.schema';
import { RegisterRequestDto } from './dto/register-request.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}
  async validateUserWithEmailAndPassword(email: string, password: string): Promise<UsersDocument> {
    return await this.usersService.getUserWithEmailAndPassword(email, password);
  }

  async login(user: IUserInfo) {
    const payload = { email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerRequest: RegisterRequestDto) {
    await this.usersService.addNewUser(registerRequest, null);
    const payload = { email: registerRequest.email };
    return {
      verifyToken: this.jwtService.sign(payload),
    };
  }

  async updatePassword(user: IUserInfo) {
    console.log(`Update password of user ${user.email}`);
  }
}
