import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { DataMustBeInFormOfStringArrayException, NotInEnumException } from '../exceptions/pipes.exception';
import { isNullOrUndefined } from '../helpers/utils';

@Injectable()
export class ParseArrayEnumPipe implements PipeTransform {
  constructor(private readonly enumInput) {}

  transform(value: any, metadata: ArgumentMetadata): any {
    const { data } = metadata;
    if (typeof value !== 'string') throw new DataMustBeInFormOfStringArrayException();
    const validValue = Object.keys(this.enumInput);
    const array = value.split(',').map((valueArray) => {
      if (isNullOrUndefined(this.enumInput[valueArray])) throw new NotInEnumException(valueArray, data, validValue);
      return this.enumInput[valueArray];
    });
    return array;
  }
}
