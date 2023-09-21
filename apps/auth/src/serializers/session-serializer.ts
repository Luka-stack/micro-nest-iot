import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: VerifyCallback) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: VerifyCallback) {
    console.log('Payload', payload);

    if (!payload.email) return done(null, null);

    const user = await this.authService.findUser(payload.email);

    console.log('DBUser', user);

    if (user) {
      return done(null, user);
    }

    return done(null, payload);
  }
}
