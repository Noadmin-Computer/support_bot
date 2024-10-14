import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminsService } from './admin.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Admin> {
    console.log('Registering admin:', registerDto);
    const { email, password } = registerDto;

    const existingAdmin = await this.adminService.findByEmail(email);
    if (existingAdmin) {
      throw new UnauthorizedException('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await this.adminService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return newAdmin;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const admin = await this.adminService.findByEmail(email);
    if (!admin || !(await this.validatePassword(password, admin.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: admin.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: 'support_bot',
      expiresIn: '7d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: 'support_bot',
      expiresIn: '7d',
    });

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    await this.adminService.updateRefreshToken(
      admin._id.toString(),
      refreshToken,
    );

    return { accessToken, refreshToken };
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async refreshToken(refreshToken: string) {
    const admin = await this.adminService.findByRefreshToken(refreshToken);
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }

    if (admin.refreshToken !== refreshToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const newRefreshToken = this.jwtService.sign(
      { email: admin.email },
      { expiresIn: '7d' },
    );
    const newAccessToken = this.jwtService.sign(
      { email: admin.email },
      { expiresIn: '1h' },
    );

    await this.adminService.updateRefreshToken(
      admin._id.toString(),
      newRefreshToken,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
