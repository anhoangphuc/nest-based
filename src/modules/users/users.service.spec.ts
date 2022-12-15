import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule } from '../../shares/helpers/setup-test';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/users.schema';
import { CreateNewUserRequestDto } from './dto/create-new-user.request.dto';

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
    const createUserRequest: CreateNewUserRequestDto = { email: 'hoangphucnb97@gmail.com', password: '1' };
    const newUser = await service.addNewUserWithNewTransaction(createUserRequest);
    expect(newUser.email).toEqual(createUserRequest.email);
    expect(newUser.password).toEqual(createUserRequest.password);
  });
});
