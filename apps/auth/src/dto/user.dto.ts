import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  email: string;

  displayName: string;

  @Expose({ groups: ['auth'] })
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
