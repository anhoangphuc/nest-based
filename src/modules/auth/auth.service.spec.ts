import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtExpireTime, JwtSecretKey } from '../../shares/constants/auth.constant';

describe(`AuthService`, () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: JwtSecretKey,
          signOptions: {
            expiresIn: JwtExpireTime,
          },
        }),
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
      const res = await service.validateUserWithUsernameAndPassword('hoangphucnb97@gmail.com', '1');
      expect(res.username === 'hoangphucnb97@gmail.com');
    });

    it(`Login with not correct user`, async () => {
      const res = await service.validateUserWithUsernameAndPassword(`hoangphucnb97@gmail.com`, '2');
      expect(res).toBeNull();
    });
  });

  it(`User login`, async () => {
    const res = await service.login({ username: 'hoangphucnb97@gmail.com' });
    expect(res).toBeDefined();
    expect(res.access_token).toBeDefined();
  });
});
