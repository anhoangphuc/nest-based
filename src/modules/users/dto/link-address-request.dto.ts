import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class LinkAddressRequestDto {
  @Expose()
  @ApiProperty({
    type: Number,
    description: 'ChainId of the network',
    example: 1,
  })
  @IsNumber()
  chainId: number;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Signature of link address request',
    example: '0x123...',
  })
  @IsString()
  signature: string;
}
