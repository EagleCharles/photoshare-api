import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Matches your .env file
      secretOrKey: process.env.JWT_SECRET || 'SUPER_SECRET_KEY', 
    });
  }

  async validate(payload: any) {
    // This attaches the user to the Request object (req.user)
    return { userId: payload.sub, email: payload.email };
  }
}