import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { ClientSession, Model } from 'mongoose';
import { withTransaction } from '../../shares/helpers/transaction';
import { hashString, isHashEqual } from '../../shares/helpers/cryptography';
import { IUsersSearch } from '../../shares/interfaces/users-search.interface';
import { isEmpty, isNullOrUndefined } from '../../shares/helpers/utils';
import {
  ListUserNotFoundException,
  UserAlreadyExistException,
  UserNotFoundException,
} from '../../shares/exceptions/users.exception';
import { RegisterRequestDto } from '../auth/dto/register-request.dto';
import { UsersRole } from '../../shares/enums/users-role.enum';
import { UpdatePasswordRequestDto } from '../auth/dto/update-password-request.dto';
import { LinkAddressRequestDto } from './dto/link-address-request.dto';
import { EthSignatureService } from '../account-signature/eth-signature.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    private readonly ethSignatureService: EthSignatureService,
  ) {}

  async addNewUser(registerRequestDto: RegisterRequestDto, session: ClientSession): Promise<UsersDocument> {
    const user = await this.usersModel.findOne({ email: registerRequestDto.email });
    if (!isNullOrUndefined(user) && user.role === UsersRole.USER_ACTIVATED) {
      throw new UserAlreadyExistException(registerRequestDto.email);
    }
    registerRequestDto.password = await hashString(registerRequestDto.password);
    const res = await this.usersModel.findOneAndUpdate(
      { email: registerRequestDto.email },
      { password: registerRequestDto.password },
      { session, upsert: true, new: true },
    );
    return res.toObject();
  }

  async updatePassword(
    email: string,
    updatePassword: UpdatePasswordRequestDto,
    session: ClientSession,
  ): Promise<UsersDocument> {
    updatePassword.newPassword = await hashString(updatePassword.newPassword);
    const res = await this.usersModel.findOneAndUpdate(
      {
        email,
      },
      { password: updatePassword.newPassword },
      { session, new: true },
    );
    return res.toObject();
  }

  async activateUser(email: string, session: ClientSession): Promise<UsersDocument> {
    const user = await this.usersModel.findOne({ email }, {}, { session });
    if (isNullOrUndefined(user)) throw new UserNotFoundException({ email });
    if (user.role === UsersRole.USER_ACTIVATED) throw new UserAlreadyExistException(email);
    return (
      await this.usersModel.findOneAndUpdate({ email }, { role: UsersRole.USER_ACTIVATED }, { session, new: true })
    ).toObject();
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
    const filter = {};
    if (!isEmpty(option.email)) {
      filter['email'] = { $in: option.email };
    }
    if (!isEmpty(option.role)) {
      filter['role'] = { $in: option.role };
    }
    const users = await this.usersModel.find(filter, {}, { session });
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

  async linkAddress(
    email: string,
    linkAddressRequest: LinkAddressRequestDto,
    session: ClientSession,
    throwException = false,
  ): Promise<UsersDocument> {
    const ethAddress = await this.ethSignatureService.verifyEthLinkAddressSignature(
      linkAddressRequest.chainId,
      linkAddressRequest.signature,
    );
    const user = await this.usersModel.findOneAndUpdate(
      {
        email,
      },
      { ethAddress: ethAddress },
      { session, new: true },
    );
    if (isNullOrUndefined(user) && throwException === true) throw new UserNotFoundException({ email });
    return isNullOrUndefined(user) ? user : user.toObject();
  }
}
