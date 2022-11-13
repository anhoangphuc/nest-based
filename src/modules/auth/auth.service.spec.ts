import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './strategies/local.strategy';

describe(`AuthService`, () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService, LocalStrategy],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it(`Should be defined`, () => {
    expect(service).toBeDefined();
  });

  describe(`validate user`, () => {
    it(`Login success`, async () => {
      const res = await service.validateUserWithUsernameAndPassword('hoangphucnb97@gmail.com', '1');
      expect(res.username === 'hoangphucnb97@gmail.com' && res.password === '1');
    });

    it(`Login with not correct user`, async () => {
      const res = await service.validateUserWithUsernameAndPassword(`hoangphucnb97@gmail.com`, '2');
      expect(res).toBeNull();
    });
  });
});
