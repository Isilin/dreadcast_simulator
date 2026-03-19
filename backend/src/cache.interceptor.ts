import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const CACHE_HEADER = 'public, max-age=3600, stale-while-revalidate=86400';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = context.switchToHttp().getRequest<any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reply = context.switchToHttp().getResponse<any>();

    return next.handle().pipe(
      tap(() => {
        if (request.method === 'GET') {
          // reply.header() works on both Fastify and Express
          reply.header('Cache-Control', CACHE_HEADER);
        }
      }),
    );
  }
}
