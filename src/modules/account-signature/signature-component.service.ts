import { Injectable } from '@nestjs/common';
import { ConfigService } from '../core/config.service';

@Injectable()
export class SignatureComponentService {
  constructor(private readonly configService: ConfigService) {}

  async getEthLinkAddressDomain(chainId: number) {
    return {
      name: this.configService.getAppName(),
      chainId,
    };
  }

  async getEthLinkAddressTypedAndValue() {
    const types = {
      Request: [{ name: 'request', type: 'string' }],
    };

    const values = {
      request: 'link_address',
    };
    return [types, values];
  }
}
