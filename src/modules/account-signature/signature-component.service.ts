import { Injectable } from '@nestjs/common';
import { ConfigService } from '../core/config.service';
import { TypedDataField } from 'ethers';

@Injectable()
export class SignatureComponentService {
  constructor(private readonly configService: ConfigService) {}

  getEthLinkAddressDomain(chainId: number) {
    return {
      name: this.configService.getAppName(),
      chainId,
    };
  }

  getEthLinkAddressTypedAndValue(): [Record<string, TypedDataField[]>, Record<string, any>] {
    const types = {
      Request: [{ name: 'request', type: 'string' }],
    } as Record<string, TypedDataField[]>;

    const values = {
      request: 'link_address',
    };
    return [types, values];
  }
}
