import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class DataMustBeInFormOfStringArrayException extends BaseException {
  constructor() {
    super(`Data must be in form of string separated by comma`, HttpStatus.BAD_REQUEST);
  }
}

export class NotInEnumException extends BaseException {
  constructor(value: string, field: string, enumValue) {
    super(`value ${value} in field ${field} must in ${enumValue}`, HttpStatus.BAD_REQUEST);
  }
}
