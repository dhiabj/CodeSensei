import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

import { AuthGuard } from './auth.guard';
import { type Request as ExpressRequest } from 'express';
import { type Response as ExpressResponse } from 'express';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. Verification email sent.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Registration successful. Please check your email to verify your account.',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Email verified successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification token',
  })
  @ApiBody({ type: VerifyEmailDto })
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Verification email sent',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email already verified',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiBody({ type: ResendVerificationDto })
  resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(
      resendVerificationDto.email,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully signed in. Tokens set in cookies.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Login successful',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiBody({ type: SignInDto })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    const { access_token, refresh_token } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    // Set access token cookie (short-lived)
    response.cookie('access_token', access_token, {
      httpOnly: true, // Prevents JavaScript access
      secure: this.configService.get('COOKIE_SECURE') === 'true', // HTTPS only in production
      sameSite:
        (this.configService.get('COOKIE_SAME_SITE') as
          | 'strict'
          | 'lax'
          | 'none') || 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
      domain: this.configService.get('COOKIE_DOMAIN'),
    });

    // Set refresh token cookie (long-lived)
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.get('COOKIE_SECURE') === 'true',
      sameSite:
        (this.configService.get('COOKIE_SAME_SITE') as
          | 'strict'
          | 'lax'
          | 'none') || 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: this.configService.get('COOKIE_DOMAIN'),
    });

    return { message: 'Login successful' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully refreshed tokens',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Token refreshed',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid refresh token',
  })
  async refresh(
    @Req() request: ExpressRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    const refreshToken = request.cookies['refresh_token'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { access_token, refresh_token } =
      await this.authService.refreshToken(refreshToken);

    // Set new access token
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: this.configService.get('COOKIE_SECURE') === 'true',
      sameSite:
        (this.configService.get('COOKIE_SAME_SITE') as
          | 'strict'
          | 'lax'
          | 'none') || 'strict',
      maxAge: 15 * 60 * 1000,
      domain: this.configService.get('COOKIE_DOMAIN'),
    });

    // Set new refresh token
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.get('COOKIE_SECURE') === 'true',
      sameSite:
        (this.configService.get('COOKIE_SAME_SITE') as
          | 'strict'
          | 'lax'
          | 'none') || 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: this.configService.get('COOKIE_DOMAIN'),
    });

    return { message: 'Token refreshed' };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async logout(
    @Req() request: ExpressRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    const refreshToken = request.cookies['refresh_token'] as string;

    if (refreshToken) {
      await this.authService.logout(request.user!.sub, refreshToken);
    }

    // Clear cookies
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get('COOKIE_SECURE') === 'true',
      sameSite:
        (this.configService.get('COOKIE_SAME_SITE') as
          | 'strict'
          | 'lax'
          | 'none') || 'strict',
      domain: this.configService.get('COOKIE_DOMAIN'),
    });

    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get('COOKIE_SECURE') === 'true',
      sameSite:
        (this.configService.get('COOKIE_SAME_SITE') as
          | 'strict'
          | 'lax'
          | 'none') || 'strict',
      domain: this.configService.get('COOKIE_DOMAIN'),
    });

    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user profile',
    schema: {
      type: 'object',
      properties: {
        sub: {
          type: 'string',
          example: '507f1f77bcf86cd799439011',
        },
        email: {
          type: 'string',
          example: 'user@example.com',
        },
        iat: {
          type: 'number',
          example: 1516239022,
        },
        exp: {
          type: 'number',
          example: 1516242622,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  getProfile(@Req() request: ExpressRequest) {
    return request.user;
  }
}
