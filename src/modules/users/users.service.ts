import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { ClientSession, Model } from 'mongoose';
import { CreateNewUserRequestDto } from './dto/create-new-user.request.dto';
import { withTransaction } from '../../shares/helpers/transaction';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<UsersDocument>) {}

  async addNewUser(createNewUserRequest: CreateNewUserRequestDto, session: ClientSession): Promise<UsersDocument> {
    const res = await this.usersModel.create([createNewUserRequest], { session });
    return res[0];
  }

  async addNewUserWithNewTransaction(createNewUserRequest: CreateNewUserRequestDto): Promise<UsersDocument> {
    try {
      return withTransaction(this.usersModel.db, async (session) => {
        return await this.addNewUser(createNewUserRequest, session);
      });
    } catch (error) {
      console.error('Add new user error', error);
      throw error;
    }
  }

  async getListOfUsers(session: ClientSession): Promise<UsersDocument[]> {
    return this.usersModel.find({});
  }
}
