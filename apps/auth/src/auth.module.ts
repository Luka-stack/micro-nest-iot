import { Module } from '@nestjs/common';
import { GoogleController } from './controllers/google.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB_URI } from 'apps/analyser/src/constants/database';
import { User, UserSchema } from './schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './serializers/session-serializer';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from '@iot/security';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    SecurityModule,
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_SECONDS')}s`,
        },
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(MONGODB_URI),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [GoogleController, AuthController],
  providers: [AuthService, GoogleStrategy, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
