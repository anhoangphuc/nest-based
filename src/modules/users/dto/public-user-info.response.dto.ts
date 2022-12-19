import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PublicUserInfoResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Email of user',
    example: 'john@email.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description: 'Is user activated',
    example: true,
  })
  isActivated: boolean;
}
