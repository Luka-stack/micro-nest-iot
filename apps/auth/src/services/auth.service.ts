import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { USER_ROLES } from '@iot/security';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { UserDto } from '../dto/user.dto';
import { GOOGLE_TOKEN_INFO } from '../constants';
import { User, UserDocument } from '../schema/user.schema';
import { LocalSignupPayload } from '../payload/local-signup.payload';
import { ProviderLoginPayload } from '../payload/provider-login.payload';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findUser(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async localSignup(signup: LocalSignupPayload) {
    this.validateAppKey(signup.appKey);

    const salt = bcrypt.genSaltSync();
    const hashed = bcrypt.hashSync(signup.password, salt);

    try {
      const user = await this.userModel.create({
        ...signup,
        password: hashed,
        role:
          signup.appKey === this.configService.get('NEXT_APP_KEY')
            ? USER_ROLES.EMPLOYEE
            : USER_ROLES.MAINTAINER,
      });

      return plainToInstance(UserDto, user.toObject(), { groups: ['auth'] });
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
      return plainToInstance(UserDto, user.toObject(), { groups: ['auth'] });
    }

    throw new BadRequestException('Wrong credentials.');
  }

  login(user: UserDto, appKey: string) {
    this.validateUserForApplication(appKey, user.role);

    if (user.role === USER_ROLES.ADMIN) {
      appKey = this.configService.get('ADMIN_APP_KEY');
    }

    const accessToken = this.jwtService.sign(
      instanceToPlain(user, { groups: ['auth'] }),
    );

    return { accessToken, user, appKey };
  }

  async loginProvider(provider: string, login: ProviderLoginPayload) {
    if (provider !== 'google') {
      throw new BadRequestException('Unsupported provider');
    }

    const response = await fetch(
      `${GOOGLE_TOKEN_INFO}?id_token=${login.idToken}`,
    );

    if (!response.ok) {
      throw new BadRequestException('Provider cannot be authenticated');
    }

    this.validateAppKey(login.appKey);

    let newUser = false;
    let dbUser = await this.userModel.findOne({ email: login.email });

    if (!dbUser) {
      newUser = true;
      dbUser = await this.userModel.create({
        email: login.email,
        displayName: login.name,
        role:
          login.appKey === this.configService.get('NEXT_APP_KEY')
            ? USER_ROLES.EMPLOYEE
            : USER_ROLES.MAINTAINER,
      });
    } else {
      this.validateUserForApplication(login.appKey, dbUser.role);
    }

    let appKey = login.appKey;
    if (dbUser.role === USER_ROLES.ADMIN) {
      appKey = this.configService.get('ADMIN_APP_KEY');
    }

    const user = plainToInstance(UserDto, dbUser.toObject(), {
      groups: ['auth'],
    });

    const accessToken = this.jwtService.sign(
      instanceToPlain(user, { groups: ['auth'] }),
    );

    return { accessToken, user, newUser, appKey };
  }

  private validateAppKey(appKey: string) {
    if (appKey !== this.configService.get('NEXT_APP_KEY')) {
      throw new UnauthorizedException('We cannot authorize your credentials');
    }
  }

  private validateUserForApplication(appKey: string, userRole: string) {
    if (userRole === USER_ROLES.ADMIN) {
      return;
    }

    if (
      userRole === USER_ROLES.EMPLOYEE &&
      appKey !== this.configService.get('NEXT_APP_KEY')
    ) {
      throw new UnauthorizedException('Wrong credentials!');
    }

    if (
      userRole === USER_ROLES.MAINTAINER &&
      appKey !== this.configService.get('SVELTE_APP_KEY')
    ) {
      throw new UnauthorizedException('Wrong credentials!');
    }
  }
}
