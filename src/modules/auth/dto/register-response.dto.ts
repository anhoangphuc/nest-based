import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PublicUserInfoResponseDto } from '../../users/dto/public-user-info.response.dto';

@Exclude()
export class RegisterResponseDto extends PublicUserInfoResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Verify token to verify account',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhvYW5',
  })
  verifyToken: string;
}
