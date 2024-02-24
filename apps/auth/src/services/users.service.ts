import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user.dto';
import { UserRole } from '@iot/security';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async readUsers(userRole: UserRole) {
    const users = await this.userModel.find({ role: userRole }).lean();

    return plainToInstance(UserDto, users);
  }
}
