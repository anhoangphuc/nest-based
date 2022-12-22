import { EthSignatureService } from './eth-signature.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SignatureComponentService } from './signature-component.service';
import { CoreModule } from '../core/core.module';
import { ethers, TypedDataField } from 'ethers';
import { sign } from 'crypto';

describe(`EthService`, () => {
  let service: EthSignatureService;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CoreModule.register({ folder: './configuration' })],
      providers: [EthSignatureService, SignatureComponentService],
    }).compile();
    service = moduleRef.get<EthSignatureService>(EthSignatureService);
  });

  it(`Should be defined`, () => {
    expect(service).toBeDefined();
  });

  it(`Verify signature success`, async () => {
    const signer = ethers.Wallet.createRandom();
    const chainId = 1;
    const domain = {
      name: 'nest-based',
      chainId,
    };
    const types = {
      Request: [{ name: 'request', type: 'string' }],
    };

    const values = {
      request: 'link_address',
    };

    const signature = await signer._signTypedData(domain, types, values);

    const verifiedAddress = await service.verifyEthLinkAddressSignature(chainId, signature);
    expect(verifiedAddress).toEqual(signer.address);
  });
});
