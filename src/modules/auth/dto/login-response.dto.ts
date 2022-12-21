import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PublicUserInfoResponseDto } from '../../users/dto/public-user-info.response.dto';

@Exclude()
export class LoginResponseDto extends PublicUserInfoResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhvYW5',
  })
  accessToken: string;
}
