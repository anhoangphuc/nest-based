import { Injectable } from '@nestjs/common';
import { IUserInfo } from './user-info.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersDocument } from '../users/schema/users.schema';
import { RegisterRequestDto } from './dto/register-request.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
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
    await this.usersService.addNewUserWithNewTransaction(registerRequest);
    const payload = { email: registerRequest.email };
    return {
      verifyToken: this.jwtService.sign(payload, {
        secret: this.configService.getAuthConfiguration().verifyToken.secretKey,
        expiresIn: this.configService.getAuthConfiguration().verifyToken.expireTime,
      }),
    };
  }

  async updatePassword(user: IUserInfo) {
    console.log(`Update password of user ${user.email}`);
  }
}
