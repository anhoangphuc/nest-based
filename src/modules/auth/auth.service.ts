import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersDocument } from '../users/schema/users.schema';
import { RegisterRequestDto } from './dto/register-request.dto';
import { ConfigService } from '../config/config.service';
import { PublicUserInfoResponseDto } from '../users/dto/public-user-info.response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { VerifyTokenNotValidException } from '../../shares/exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}
  async validateUserWithEmailAndPassword(email: string, password: string): Promise<UsersDocument> {
    return await this.usersService.getUserWithEmailAndPassword(email, password);
  }

  async login(user: PublicUserInfoResponseDto) {
    const payload = { email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerRequest: RegisterRequestDto) {
    const user = await this.usersService.addNewUserWithNewTransaction(registerRequest);
    const payload = { email: registerRequest.email };
    return {
      ...user,
      verifyToken: this.jwtService.sign(payload, {
        secret: this.configService.getAuthConfiguration().verifyToken.secretKey,
        expiresIn: this.configService.getAuthConfiguration().verifyToken.expireTime,
      }),
    };
  }

  async verifyToken(token: string) {
    let decodedData;
    try {
      decodedData = await this.jwtService.verify(token, {
        secret: this.configService.getAuthConfiguration().verifyToken.secretKey,
      });
    } catch (e) {
      this.logger.error(e);
      throw new VerifyTokenNotValidException();
    }
    return await this.usersService.activateUser(decodedData.email, null);
  }

  async updatePassword(user: PublicUserInfoResponseDto) {
    console.log(`Update password of user ${user.email}`);
  }
}
