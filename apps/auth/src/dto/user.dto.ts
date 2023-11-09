import { Exclude } from 'class-transformer';

export class UserDto {
  email: string;

  displayName: string;

  role: string;

  @Exclude()
  _id: any;

  @Exclude()
  password: string;

  @Exclude()
  authenticated: boolean;

  @Exclude()
  __v: number;
}
