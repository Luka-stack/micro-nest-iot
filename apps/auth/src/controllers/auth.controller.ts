import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SSOUser } from '../decorators/sso-user.decorator';
import { AuthService } from '../auth.service';
import { OAuthSignupDto } from '../dto/oauth-signup.dto';
import { OAuthSignupGuard } from '../guards/oauth-signup.guard';
import { LocalSignupDto } from '../dto/local-signup.dto';
import { UserDto } from '../dto/user.dto';
import { UserResponse } from '../dto/user.response';
import { LocalGuard } from '../guards/local.guard';
import { CurrentUser, JwtAuthGuard, UserPayload } from '@iot/security';

@Controller('/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('ssouser')
  ssoUser(@SSOUser() user: UserDto): UserResponse {
    return { data: user };
  }

  @Get('whoiam')
  @UseGuards(JwtAuthGuard)
  whoiam(@CurrentUser() user: UserPayload) {
    return { data: user };
  }

  @Post('/signup/oauth')
  @UseGuards(OAuthSignupGuard)
  oauthSignup(@Body() signup: OAuthSignupDto): Promise<UserResponse> {
    return this.authService.oauthSignup(signup);
  }

  @Post('/signup')
  @HttpCode(201)
  localSignup(@Body() signup: LocalSignupDto): Promise<UserResponse> {
    return this.authService.localSignup(signup);
  }

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalGuard)
  login(@SSOUser() user: UserDto) {
    const accessToken = this.authService.login(user);

    return { accessToken, user };
  }
}
