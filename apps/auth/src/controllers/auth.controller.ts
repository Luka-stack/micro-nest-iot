import { Controller, Get } from '@nestjs/common';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('/v1')
export class AuthController {
  @Get('whoiam')
  whoiam(@GetUser() user) {
    return { data: user };
  }
}
