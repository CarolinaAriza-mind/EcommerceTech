import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: JwtPayload & { roles?: string[]; role?: string };
  }
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}
