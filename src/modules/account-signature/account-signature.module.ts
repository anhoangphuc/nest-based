import { Module } from '@nestjs/common';
import { EthSignatureService } from './eth-signature.service';
import { SignatureComponentService } from './signature-component.service';

@Module({
  providers: [EthSignatureService, SignatureComponentService],
  exports: [EthSignatureService],
})
export class AccountSignatureModule {}
