import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user.dto';

export const SSOUser = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (request.user && request.user.authenticated) {
      return plainToInstance(UserDto, request.user.toObject());
    }

    return request.user;
  },
);
