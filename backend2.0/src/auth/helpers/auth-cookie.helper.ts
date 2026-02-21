import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthCookieHelper {
  constructor(private readonly configService: ConfigService) {}

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite: this.configService.getOrThrow<'strict' | 'lax' | 'none'>(
        'COOKIE_SAME_SITE',
        'strict',
      ),
      domain: this.configService.getOrThrow<string>('COOKIE_DOMAIN'),
    };
  }

  setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const options = this.getCookieOptions();

    response.cookie('access_token', accessToken, {
      ...options,
      maxAge: this.configService.getOrThrow<number>(
        'ACCESS_TOKEN_EXPIRATION_MS',
      ),
    });

    response.cookie('refresh_token', refreshToken, {
      ...options,
      maxAge: this.configService.getOrThrow<number>(
        'REFRESH_TOKEN_EXPIRATION_MS',
      ),
    });
  }

  clearAuthCookies(response: Response) {
    const options = this.getCookieOptions();

    response.clearCookie('access_token', options);
    response.clearCookie('refresh_token', options);
  }
}
