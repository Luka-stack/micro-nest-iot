import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { User, UserDocument } from './schema/user.schema';
import { OAuthSignupDto } from './dto/oauth-signup.dto';
import { LocalSignupDto } from './dto/local-signup.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async oauthSignup(signup: OAuthSignupDto) {
    const user = await this.userModel.create({
      ...signup,
      authenticated: true,
    });

    return { data: plainToInstance(UserDto, user.toObject()) };
  }

  async localSignup(signup: LocalSignupDto) {
    const salt = bcrypt.genSaltSync();
    const hashed = bcrypt.hashSync(signup.password, salt);

    try {
      const user = await this.userModel.create({
        ...signup,
        password: hashed,
        authenticated: true,
      });

      return { data: plainToInstance(UserDto, user.toObject()) };
    } catch (err) {
      if (err.code && err.code === 11000) {
        throw new BadRequestException({
          email: 'Email already in use',
        });
      }

      throw new InternalServerErrorException(
        "We couldn't create account for you. Try later",
      );
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Wrong credentials.');
    }

    const valid = bcrypt.compareSync(password, user.password);

    if (valid) {
      return user;
    }

    throw new BadRequestException('Wrong credentials.');
  }

  login(user: UserDto) {
    return this.jwtService.sign(instanceToPlain(user));
  }
}
