import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthService } from '../auth.service';
import { OAuthSignupDto } from '../dto/oauth-signup.dto';
import { OAuthSignupGuard } from '../guards/oauth-signup.guard';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('whoiam')
  whoiam(@GetUser() user) {
    return { data: user };
  }

  @Post('/signup/oauth')
  @UseGuards(OAuthSignupGuard)
  signup(@Body() signup: OAuthSignupDto) {
    return this.authService.signupUp(signup);
  }

  @Get('/authenticated')
  @UseGuards(AuthenticatedGuard)
  authenticated(@GetUser() user) {
    return user;
  }
}
