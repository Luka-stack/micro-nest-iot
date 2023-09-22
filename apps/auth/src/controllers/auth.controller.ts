import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthService } from '../auth.service';
import { OAuthSignupDto } from '../dto/oauth-signup.dto';
import { OAuthSignupGuard } from '../guards/oauth-signup.guard';
import { LocalSignupDto } from '../dto/local-signup.dto';
import { LocalGuard } from '../guards/local.guard';
import { UserDto } from '../dto/user.dto';
import { UserResponse } from '../dto/user.response';

@Controller('/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('whoiam')
  whoiam(@GetUser() user: UserDto): UserResponse {
    return { data: user };
  }

  @Post('/signup/oauth')
  @UseGuards(OAuthSignupGuard)
  oauthSignup(@Body() signup: OAuthSignupDto): Promise<UserResponse> {
    return this.authService.oauthSignup(signup);
  }

  @Post('/signup')
  localSignup(@Body() signup: LocalSignupDto): Promise<UserResponse> {
    return this.authService.localSignup(signup);
  }

  @Post('/login')
  @UseGuards(LocalGuard)
  login(@GetUser() user: UserDto): UserResponse {
    return { data: user };
  }
}
