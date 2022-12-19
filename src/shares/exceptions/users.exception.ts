import { BaseException } from './base.exception';
import { IUsersSearch } from '../interfaces/users-search.interface';
import { HttpStatus } from '@nestjs/common';

export class ListUserNotFoundException extends BaseException {
  constructor(option: IUsersSearch) {
    super(`Not find users satisfied ${JSON.stringify(option)}`, HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundException extends BaseException {
  constructor(option: any) {
    super(`Not find user satisfied ${JSON.stringify(option)}`, HttpStatus.BAD_REQUEST);
  }
}

export class UserAlreadyExistException extends BaseException {
  constructor(email: string) {
    super(`User with email ${email} already registered`, HttpStatus.BAD_REQUEST);
  }
}
