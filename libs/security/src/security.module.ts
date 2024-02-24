import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type SecurityModuleOptions = {
  secret: string;
  expiresInSeconds: string;
};

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, RolesGuard],
  exports: [],
})
export class SecurityModule {
  static register({
    secret,
    expiresInSeconds,
  }: SecurityModuleOptions): DynamicModule {
    return {
      module: SecurityModule,
      imports: [
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>(secret),
            signOptions: {
              expiresIn: `${configService.get<string>(expiresInSeconds)}s`,
            },
          }),
        }),
      ],
      exports: [JwtModule],
    };
  }
}
