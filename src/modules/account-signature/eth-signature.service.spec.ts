import { EthSignatureService } from './eth-signature.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SignatureComponentService } from './signature-component.service';
import { CoreModule } from '../core/core.module';

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
});
