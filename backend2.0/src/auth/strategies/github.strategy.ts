import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';
import { OAuthUser } from '../interfaces/oauth.interface';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const { id, emails } = profile;

    const email = emails?.[0]?.value;
    const githubId = id;

    if (!email) {
      throw new Error('No email associated with this GitHub account');
    }

    const user: OAuthUser = {
      githubId,
      email,
      provider: 'github',
    };
    return user;
  }
}
