import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class UserUnauthorizedException extends BaseException {
  constructor(msg: string) {
    super(msg, HttpStatus.UNAUTHORIZED);
  }
}
