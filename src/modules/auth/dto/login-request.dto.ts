import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class LoginRequestDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Email of user',
    example: 'john@email.com',
  })
  username: string;
  @ApiProperty({
    type: String,
    description: 'Password of user',
    example: '1',
  })
  password: string;
}
