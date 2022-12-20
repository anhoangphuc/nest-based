import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

@Exclude()
export class LoginRequestDto {
  @Expose()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email of user',
    example: 'john@email.com',
  })
  email: string;
  @ApiProperty({
    type: String,
    description: 'Password of user',
    example: '1',
  })
  password: string;
}
