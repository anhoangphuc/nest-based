import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateNewUserRequestDto {
  @Expose()
  email: string;

  @Expose()
  password: string;
}
