import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStorage } from './local.strategy';
import { User } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtStorage } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET', 'test123456'),
      signOptions: { expiresIn: '4h' },
    };
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 确保 ConfigModule 全局可用.,
    TypeOrmModule.forFeature([User]),
    HttpModule,
    PassportModule,
    jwtModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage, JwtStorage],
  exports: [jwtModule],
})
export class AuthModule {}
