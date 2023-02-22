import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { randomEmail, randomPassword, rootMongooseTestModule, startRedisServer } from '../../shares/helpers/setup-test';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/users.schema';
import { isHashEqual } from '../../shares/helpers/cryptography';
import { RegisterRequestDto } from '../auth/dto/register-request.dto';
import { AccountSignatureModule } from '../account-signature/account-signature.module';
import { DynamicModule } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { EthSignatureService } from '../account-signature/eth-signature.service';

describe('UsersService', () => {
  let service: UsersService;
  const AccountSignatureModuleTest: DynamicModule = {
    module: AccountSignatureModule,
    imports: [CoreModule.register({ folder: './configuration' })],
    exports: [EthSignatureService],
  };
  beforeAll(async () => {
    await startRedisServer();
  });
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
        AccountSignatureModuleTest,
      ],
      providers: [UsersService],
    }).compile();
    service = moduleRef.get<UsersService>(UsersService);
  });

  it(`Should be defined`, () => {
    expect(service).toBeDefined();
  });

  it(`Add new user success`, async () => {
    const createUserRequest: RegisterRequestDto = { email: randomEmail(), password: randomPassword() };
    const newUser = await service.addNewUserWithNewTransaction(createUserRequest);
    expect(newUser.email).toEqual(createUserRequest.email);
    expect(isHashEqual('1', newUser.password));
  });
});
