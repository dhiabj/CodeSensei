import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailService } from 'src/email/email.service';

import { RegisterDto } from './dto/register.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { OAuthUser } from './interfaces/oauth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  private async generateTokens(payload: JwtPayload): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    // Check if user already exists
    const userExists = await this.usersService.existsByEmail(registerDto.email);
    if (userExists) {
      throw new ConflictException('User with this email already exists.');
    }

    // Create user
    const user = await this.usersService.create(registerDto);

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.emailVerificationToken!,
      );
    } catch {
      throw new BadRequestException(
        'Failed to send verification email. Please try again.',
      );
    }

    return {
      message: 'Check your email to verify your account.',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const isVerified = await this.usersService.verifyEmail(token);

    if (!isVerified) {
      throw new BadRequestException('Invalid or expired verification token.');
    }

    return { message: 'Email verified successfully.' };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.usersService.updateVerificationToken(email);

    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.emailVerificationToken!,
      );
    } catch {
      throw new BadRequestException(
        'Failed to send verification email. Please try again.',
      );
    }

    return { message: 'Verification email sent.' };
  }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { sub: user._id.toString(), email: user.email };

    const tokens = await this.generateTokens(payload);

    await this.usersService.addRefreshToken(
      user._id.toString(),
      tokens.refresh_token,
    );

    return tokens;
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
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Generate new tokens
    const newPayload = { sub: user._id.toString(), email: user.email };

    const tokens = await this.generateTokens(newPayload);

    await this.usersService.replaceRefreshToken(
      user._id.toString(),
      refreshToken,
      tokens.refresh_token,
    );

    return tokens;
  }

  async validateOAuthLogin(
    oauthUser: OAuthUser,
  ): Promise<{ access_token: string; refresh_token: string }> {
    let user: UserDocument | null = null;
    try {
      // Check if user exists by OAuth ID
      if (oauthUser.googleId) {
        user = await this.usersService.findByGoogleId(oauthUser.googleId);
      } else if (oauthUser.githubId) {
        user = await this.usersService.findByGithubId(oauthUser.githubId);
      }

      // If not found by OAuth ID, check by email
      if (!user) {
        user = await this.usersService.findByEmail(oauthUser.email);

        if (user) {
          // Update existing user with OAuth ID
          if (oauthUser.googleId) {
            user.googleId = oauthUser.googleId;
          } else if (oauthUser.githubId) {
            user.githubId = oauthUser.githubId;
          }
          user.isEmailVerified = true;

          await user.save();
        } else {
          user = await this.usersService.createOAuthUser(oauthUser);
        }
      }

      // Generate tokens
      const payload = { sub: user._id.toString(), email: user.email };

      const tokens = await this.generateTokens(payload);

      await this.usersService.addRefreshToken(
        user._id.toString(),
        tokens.refresh_token,
      );

      return tokens;
    } catch (error) {
      this.logger.error(`OAuth Login Failed: ${error}`);
      throw new UnauthorizedException('Authentication failed.');
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.usersService.removeRefreshToken(userId, refreshToken);
  }
}
