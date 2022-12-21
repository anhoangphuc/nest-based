import { PublicUserInfoResponseDto } from './public-user-info.response.dto';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UsersInfoResponseDto extends PublicUserInfoResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'Id of user in db',
  })
  id: string;
}
