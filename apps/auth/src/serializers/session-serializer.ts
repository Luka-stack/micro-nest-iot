import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { VerifyCallback } from 'passport-google-oauth20';
import { UserDocument } from '../schema/user.schema';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: UserDocument, done: VerifyCallback) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: VerifyCallback) {
    if (!payload.email) return done(null, null);

    const user = await this.authService.findUser(payload.email);

    if (user) {
      return done(null, user);
    }

    return done(null, payload);
  }
}
