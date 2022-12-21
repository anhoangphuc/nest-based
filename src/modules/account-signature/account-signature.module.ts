import { Module } from '@nestjs/common';
import { EthSignatureService } from './eth-signature.service';

@Module({
  providers: [EthSignatureService],
  exports: [EthSignatureService],
})
export class AccountSignatureModule {}
