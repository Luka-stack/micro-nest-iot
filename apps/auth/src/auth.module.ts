import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { SecurityModule } from '@iot/security';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { User, UserSchema } from './schema/user.schema';
import { JWT_EXPIRATION, JWT_SECRET, MONGODB_URI } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    SecurityModule.register({
      secret: JWT_SECRET,
      expiresInSeconds: JWT_EXPIRATION,
    }),
    PassportModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(MONGODB_URI),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService, LocalStrategy],
})
export class AuthModule {}
