import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { randomEmail, randomPassword, rootMongooseTestModule } from '../../shares/helpers/setup-test';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../users/schema/users.schema';
import { DynamicModule } from '@nestjs/common';
import { sleep } from '../../shares/helpers/utils';

describe(`AuthService`, () => {
  let service: AuthService;
  const UsersModuleTest: DynamicModule = {
    module: UsersModule,
    imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
    providers: [UsersService],
    exports: [UsersService],
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule.register({ folder: './configuration' }),
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.getAuthConfiguration().jwt.secretKey,
            signOptions: {
              expiresIn: configService.getAuthConfiguration().jwt.expireTime,
            },
          }),
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
      expect(res.isActivated).toEqual(false);
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
      expect(notActivatedUser.isActivated).toEqual(false);
      await service.verifyToken(verifyToken.verifyToken);
      const res = await service.validateUserWithEmailAndPassword(email, password);
      expect(res.email === email);
      expect(res.isActivated).toEqual(true);
    });

    it(`Verify user failed when token expired`, async () => {
      const email = randomEmail();
      const password = randomPassword();
      const verifyToken = await service.register({ email, password });
      await sleep(2000);
      await expect(() => service.verifyToken(verifyToken.verifyToken)).rejects.toThrowError('jwt expired');
    });

    it(`Login with not correct user`, async () => {
      const res = await service.validateUserWithEmailAndPassword(randomEmail(), randomPassword());
      expect(res).toBeNull();
    });
  });

  it(`User login`, async () => {
    const res = await service.login({ email: 'hoangphucnb97@gmail.com', isActivated: false });
    expect(res).toBeDefined();
    expect(res.accessToken).toBeDefined();
  });
});
