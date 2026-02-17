import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      cookies: {
        access_token?: string;
        refresh_token?: string;
        [key: string]: string | undefined;
      };
    }
  }
}
