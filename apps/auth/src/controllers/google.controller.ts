import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Controller, Get, UseGuards, Res } from '@nestjs/common';

import { GoogleGuard } from '../guards/google.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { UserDto } from '../dto/user.dto';

@Controller('/v1/google')
export class GoogleController {
  constructor(private readonly configService: ConfigService) {}

  @Get('login')
  @UseGuards(GoogleGuard)
  login() {
    return { msg: 'Google Authentication ' };
  }

  @Get('redirect')
  @UseGuards(GoogleGuard)
  redirect(@GetUser() user: UserDto | null, @Res() res: Response) {
    if (user && user.authenticated) {
      return res.redirect(`${this.configService.get('CLIENT_LOCATION')}/`);
    }

    return res.redirect(
      `${this.configService.get('CLIENT_LOCATION')}/auth/signup`,
    );
  }
}
