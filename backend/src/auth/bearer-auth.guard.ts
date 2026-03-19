import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

interface RequestWithToken {
  headers: { authorization?: string };
  accessToken?: string;
}

@Injectable()
export class BearerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithToken>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Utilisateur non authentifie.');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException("Jeton d'authentification invalide.");
    }

    request.accessToken = token;
    return true;
  }
}
