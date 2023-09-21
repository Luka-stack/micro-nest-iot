import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { User, UserDocument } from './schema/user.schema';
import { OAuthSignupDto } from './dto/oauth-signup.dto';

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

  async signupUp(signup: OAuthSignupDto) {
    const user = await this.userModel.create({
      ...signup,
      authenticated: true,
    });

    return user;
  }
}
