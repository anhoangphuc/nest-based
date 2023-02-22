import { Injectable } from '@nestjs/common';
import { VERIFY_TOKEN } from '../../shares/constants/redis-prefix.constant';

@Injectable()
export class CacheService {
  getVerifyTokenKey(email: string): string {
    return `${VERIFY_TOKEN}:${email.toLowerCase()}`;
  }
}
