import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findUser(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });
    console.dir(user);

    return user;
  }
}
