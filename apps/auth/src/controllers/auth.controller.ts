import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtAuthGuard, UserPayload } from '@iot/security';

import { UserDto } from '../dto/user.dto';
import { LocalGuard } from '../guards/local.guard';
import { AuthService } from '../services/auth.service';
import { LocalSignupPayload } from '../payload/local-signup.payload';
import { ProviderLoginPayload } from '../payload/provider-login.payload';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/whoiam')
  @UseGuards(JwtAuthGuard)
  whoiam(@CurrentUser() user: UserPayload) {
    return user;
  }

  @Post('/signup')
  @HttpCode(201)
  localSignup(@Body() signup: LocalSignupPayload) {
    return this.authService.localSignup(signup);
  }

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalGuard)
  login(@CurrentUser() user: UserDto) {
    return this.authService.login(user);
  }

  @Post('/login/:provider')
  @HttpCode(200)
  async loginProvider(
    @Param('provider') provider: string,
    @Body() login: ProviderLoginPayload,
  ) {
    return this.authService.loginProvider(provider, login);
  }
}
