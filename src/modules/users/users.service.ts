import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { ClientSession, Model } from 'mongoose';
import { withTransaction } from '../../shares/helpers/transaction';
import { hashString, isHashEqual } from '../../shares/helpers/cryptography';
import { IUsersSearch } from '../../shares/interfaces/users-search.interface';
import { isNullOrUndefined } from '../../shares/helpers/utils';
import {
  ListUserNotFoundException,
  UserAlreadyExistException,
  UserNotFoundException,
} from '../../shares/exceptions/users.exception';
import { RegisterRequestDto } from '../auth/dto/register-request.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<UsersDocument>) {}

  async addNewUser(registerRequestDto: RegisterRequestDto, session: ClientSession): Promise<UsersDocument> {
    const user = await this.usersModel.findOne({ email: registerRequestDto.email });
    if (!isNullOrUndefined(user) && user.isActivated === true) {
      throw new UserAlreadyExistException(registerRequestDto.email);
    }
    registerRequestDto.password = await hashString(registerRequestDto.password);
    const res = await this.usersModel.findOneAndUpdate(
      { email: registerRequestDto.email },
      { password: registerRequestDto.password },
      { session, upsert: true, new: true },
    );
    return res;
  }

  async activateUser(email: string, session: ClientSession): Promise<UsersDocument> {
    const user = await this.usersModel.findOne({ email }, {}, { session });
    if (isNullOrUndefined(user)) throw new UserNotFoundException({ email });
    if (user.isActivated === true) throw new UserAlreadyExistException(email);
    return this.usersModel.findOneAndUpdate({ email }, { isActivated: true }, { session, new: true });
  }

  async addNewUserWithNewTransaction(registerRequest: RegisterRequestDto): Promise<UsersDocument> {
    try {
      return await withTransaction(this.usersModel.db, async (session) => {
        return await this.addNewUser(registerRequest, session);
      });
    } catch (error) {
      console.error('Add new user error', error);
      throw error;
    }
  }

  async getListOfUsers(option: IUsersSearch, session: ClientSession, throwException = false): Promise<UsersDocument[]> {
    const users = await this.usersModel.find(
      {
        email: isNullOrUndefined(option.email) ? {} : { $in: option.email },
      },
      {},
      { session },
    );
    if (users.length === 0 && throwException === true) {
      throw new ListUserNotFoundException(option);
    }
    return users;
  }

  async getUserWithEmailAndPassword(email: string, password: string, throwException = false) {
    const users = await this.getListOfUsers({ email: [email] }, null);
    const usersMatchedPass = users.filter((user) => isHashEqual(password, user.password));
    if (usersMatchedPass.length === 0 && throwException === true) {
      throw new UserNotFoundException({ email, password });
    }
    return usersMatchedPass.length === 0 ? null : usersMatchedPass[0];
  }
}
