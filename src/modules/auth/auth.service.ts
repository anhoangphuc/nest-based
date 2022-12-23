import { CACHE_MANAGER, Inject, Injectable, LoggerService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersDocument } from '../users/schema/users.schema';
import { RegisterRequestDto } from './dto/register-request.dto';
import { ConfigService } from '../core/config.service';
import { PublicUserInfoResponseDto } from '../users/dto/public-user-info.response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { VerifyTokenNotValidException } from '../../shares/exceptions/auth.exception';
import { UpdatePasswordRequestDto } from './dto/update-password-request.dto';
import { Cache } from 'cache-manager';
import { CacheService } from '../core/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
  ) {}
  async validateUserWithEmailAndPassword(email: string, password: string): Promise<UsersDocument> {
    return await this.usersService.getUserWithEmailAndPassword(email, password);
  }

  async login(user: PublicUserInfoResponseDto) {
    const payload = { email: user.email, role: user.role };
    return {
      ...payload,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerRequest: RegisterRequestDto) {
    const payload = { email: registerRequest.email };
    const verifyToken = this.jwtService.sign(payload, {
      secret: this.configService.getAuthConfiguration().verifyToken.secretKey,
      expiresIn: this.configService.getAuthConfiguration().verifyToken.expireTime,
    });
    // ttl is larger than expireTime, in case token verified on time but not found in cache
    const ttl = this.configService.getAuthConfiguration().verifyToken.expireTime + 100;
    await this.cacheManger.set(this.cacheService.getVerifyTokenKey(registerRequest.email), verifyToken, ttl);
    //Insert user in the end of the flow, in case one of the above error
    const user = await this.usersService.addNewUserWithNewTransaction(registerRequest);
    return {
      ...user,
      verifyToken,
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
    const savedVerifyToken = await this.cacheManger.get(this.cacheService.getVerifyTokenKey(decodedData.email));
    if (savedVerifyToken !== token) {
      throw new VerifyTokenNotValidException(`Verify token not latest`);
    }
    return await this.usersService.activateUser(decodedData.email, null);
  }

  async updatePassword(
    user: PublicUserInfoResponseDto,
    updatePassword: UpdatePasswordRequestDto,
  ): Promise<UsersDocument> {
    return await this.usersService.updatePassword(user.email, updatePassword, null);
  }
}
