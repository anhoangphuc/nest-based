import { Injectable } from '@nestjs/common';
import { SignatureComponentService } from './signature-component.service';
import { ethers } from 'ethers';

@Injectable()
export class EthSignatureService {
  constructor(private readonly signatureComponentService: SignatureComponentService) {}

  async verifyEthLinkAddressSignature(chainId: number, signature: string): Promise<string> {
    const domain = this.signatureComponentService.getEthLinkAddressDomain(chainId);
    const [types, values] = this.signatureComponentService.getEthLinkAddressTypedAndValue();
    return ethers.utils.verifyTypedData(domain, types, values, signature);
  }
}
