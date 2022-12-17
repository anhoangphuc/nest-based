import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class LoginResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Access token',
    example: '',
  })
  accessToken: string;
}
