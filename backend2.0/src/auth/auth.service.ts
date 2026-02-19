import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailService } from 'src/email/email.service';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    // Check if user already exists
    const userExists = await this.usersService.existsByEmail(registerDto.email);
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user
    const user = await this.usersService.create(registerDto);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.emailVerificationToken!,
    );

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const isVerified = await this.usersService.verifyEmail(token);

    if (!isVerified) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.updateVerificationToken(email);

      await this.emailService.sendVerificationEmail(
        user.email,
        user.emailVerificationToken!,
      );

      return { message: 'Verification email sent' };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Email already verified'
      ) {
        throw new BadRequestException('Email already verified');
      }
      throw error;
    }
  }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id.toString(), email: user.email };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
    });

    // Store refresh token in database
    await this.usersService.addRefreshToken(user._id.toString(), refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Verify the refresh token
    const payload = await this.jwtService.verifyAsync<JwtPayload>(
      refreshToken,
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );

    // Check if refresh token exists in database
    const user = await this.usersService.findOne(payload.sub);
    const tokenExists = await this.usersService.verifyRefreshToken(
      user._id.toString(),
      refreshToken,
    );

    if (!tokenExists) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const newPayload = { sub: user._id.toString(), email: user.email };
    const newAccessToken = await this.jwtService.signAsync(newPayload);
    const newRefreshToken = await this.jwtService.signAsync(newPayload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
    });

    // Replace old refresh token with new one
    await this.usersService.replaceRefreshToken(
      user._id.toString(),
      refreshToken,
      newRefreshToken,
    );

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.usersService.removeRefreshToken(userId, refreshToken);
  }
}
