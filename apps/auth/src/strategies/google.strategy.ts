import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:5001/auth/v1/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    console.dir({
      email: profile.emails[0].value,
      displayName: profile.displayName,
    });

    if (!profile.emails.length) return null;

    const user = await this.authService.findUser(profile.emails[0].value);

    console.log('Strategy Validate DB User', user);

    if (user) return user;

    return {
      tmp: true,
      email: profile.emails[0].value,
      displayName: profile.displayName,
    };
  }
}
