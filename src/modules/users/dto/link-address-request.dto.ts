import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Exclude()
export class LinkAddressRequestDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Address of user want to be linked',
    example: '0x123...',
  })
  @IsString()
  ethAddress: string;
}
