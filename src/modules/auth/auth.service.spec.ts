import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { rootMongooseTestModule } from '../../shares/helpers/setup-test';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../users/schema/users.schema';
import { DynamicModule } from '@nestjs/common';

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

  describe(`validate user`, () => {
    it(`Login success`, async () => {
      const res = await service.validateUserWithEmailAndPassword('hoangphucnb97@gmail.com', '1');
      expect(res.email === 'hoangphucnb97@gmail.com');
    });

    it(`Login with not correct user`, async () => {
      const res = await service.validateUserWithEmailAndPassword(`hoangphucnb97@gmail.com`, '2');
      expect(res).toBeNull();
    });
  });

  it(`User login`, async () => {
    const res = await service.login({ email: 'hoangphucnb97@gmail.com' });
    expect(res).toBeDefined();
    expect(res.accessToken).toBeDefined();
  });
});
