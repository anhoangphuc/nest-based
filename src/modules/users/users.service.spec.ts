import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule } from '../../shares/helpers/setup-test';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/users.schema';
import { RegisterRequestDto } from './dto/create-new-user.request.dto';
import { hashString, isHashEqual } from '../../shares/helpers/cryptography';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
      providers: [UsersService],
    }).compile();
    service = moduleRef.get<UsersService>(UsersService);
  });

  it(`Should be defined`, () => {
    expect(service).toBeDefined();
  });

  it(`Add new user success`, async () => {
    const createUserRequest: RegisterRequestDto = { email: 'hoangphucnb97@gmail.com', password: '1' };
    const newUser = await service.addNewUserWithNewTransaction(createUserRequest);
    expect(newUser.email).toEqual(createUserRequest.email);
    expect(isHashEqual('1', newUser.password));
  });

  it(`Throw exception when two user get the same email`, async () => {
    const createUserRequest1: RegisterRequestDto = { email: 'hoangphucnb97@gmail.com', password: '1' };
    const createUserRequest2: RegisterRequestDto = { email: 'hoangphucnb97@gmail.com', password: '2' };
    await service.addNewUserWithNewTransaction(createUserRequest1);
    await expect(async () => await service.addNewUserWithNewTransaction(createUserRequest2)).rejects.toThrowError();
  });
});
