import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from './admin.module';
import { AdminsService } from './admin.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'; // Убедитесь, что вы импортируете AuthService
import { JwtAuthGuard } from './jwt/jwt-strategy.guard';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'support_bot',
      signOptions: { expiresIn: '7d' },
    }),
    AdminModule,
  ],
  providers: [AuthService, AdminsService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AdminsService, JwtStrategy],
})
export class AuthModule {}
