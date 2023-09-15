import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';

import { GoogleGuard } from '../guards/google.guard';

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
  redirect(@Req() req: Request, @Res() res: Response) {
    console.log(req);

    return res.redirect(
      `${this.configService.get('CLIENT_LOCATION')}/auth/signup`,
    );
  }
}
