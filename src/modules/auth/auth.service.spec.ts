import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '../core/config.service';
import { CoreModule } from '../core/core.module';
import { UsersModule } from '../users/users.module';
import { randomEmail, randomPassword, rootMongooseTestModule, startRedisServer } from '../../shares/helpers/setup-test';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../users/schema/users.schema';
import { DynamicModule } from '@nestjs/common';
import { sleep } from '../../shares/helpers/utils';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { createTransports, enumerateErrorFormat, timestamp } from '../../shares/helpers/logger';
import { UsersRole } from '../../shares/enums/users-role.enum';
import { VerifyTokenNotValidException } from '../../shares/exceptions/auth.exception';

describe(`AuthService`, () => {
  let service: AuthService;
  const UsersModuleTest: DynamicModule = {
    module: UsersModule,
    imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
    providers: [UsersService],
    exports: [UsersService],
  };

  beforeAll(async () => {
    await startRedisServer();
  });
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        CoreModule.register({ folder: './configuration' }),
        WinstonModule.forRootAsync({
          useFactory: async (configService: ConfigService) => {
            const transports = createTransports(
              configService.getLoggerConfiguration().useFile,
              configService.getAppName(),
              configService.getEnvironment(),
            );
            return {
              level: 'info',
              format: winston.format.combine(timestamp(), enumerateErrorFormat()),
              transports,
            };
          },
          inject: [ConfigService],
        }),
        UsersModuleTest,
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it(`Should be defined`, () => {
    expect(service).toBeDefined();
  });

  describe(`Register user`, () => {
    it(`Register success`, async () => {
      const email = randomEmail();
      const password = randomPassword();
      await service.register({ email, password });
      const res = await service.validateUserWithEmailAndPassword(email, password);
      expect(res.email === email);
      expect(res.role).toEqual(UsersRole.USER_INACTIVATED);
    });

    it(`Register again will have new token`, async () => {
      const email = randomEmail();
      const password = randomPassword();
      await service.register({ email, password });
      const res = await service.register({ email, password });
      expect(res).toBeDefined();
      const user = await service.validateUserWithEmailAndPassword(email, '2');
      expect(user).toBeDefined();
    });
  });
  describe(`validate user`, () => {
    it(`Verify user success`, async () => {
      const email = randomEmail();
      const password = randomPassword();
      const verifyToken = await service.register({ email, password });
      const notActivatedUser = await service.validateUserWithEmailAndPassword(email, password);
      expect(notActivatedUser.role).toEqual(UsersRole.USER_INACTIVATED);
      await service.verifyToken(verifyToken.verifyToken);
      const res = await service.validateUserWithEmailAndPassword(email, password);
      expect(res.email === email);
      expect(res.role).toEqual(UsersRole.USER_ACTIVATED);
    });

    it(`Verify user failed when token expired`, async () => {
      const email = randomEmail();
      const password = randomPassword();
      const verifyToken = await service.register({ email, password });
      await sleep(2000);
      await expect(() => service.verifyToken(verifyToken.verifyToken)).rejects.toThrowError(
        new VerifyTokenNotValidException(),
      );
    });

    it(`Login with not correct user`, async () => {
      const res = await service.validateUserWithEmailAndPassword(randomEmail(), randomPassword());
      expect(res).toBeNull();
    });
  });

  it(`User login`, async () => {
    const res = await service.login({ email: randomEmail(), role: UsersRole.USER_INACTIVATED });
    expect(res).toBeDefined();
    expect(res.accessToken).toBeDefined();
  });
});
