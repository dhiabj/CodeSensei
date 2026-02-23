export interface AuthCredentials {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface AuthResponse {
  message: string;
}

export interface User {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
