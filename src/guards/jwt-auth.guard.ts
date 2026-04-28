import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    this.logger.log(`Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
    
    if (!authHeader) {
      this.logger.warn('No authorization header found');
      throw new UnauthorizedException('No token provided');
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this.logger.log(`HandleRequest - Error: ${err?.message}, User: ${!!user}, Info: ${info?.message}`);
    
    if (err || !user) {
      this.logger.error(`Authentication failed: ${info?.message || err?.message}`);
      
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      
      throw err || new UnauthorizedException('Authentication required');
    }
    
    this.logger.log(`User authenticated successfully: ${user.email || user.id}`);
    return user;
  }
}