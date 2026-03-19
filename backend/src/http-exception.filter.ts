import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reply = ctx.getResponse<any>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : (response as Record<string, unknown>).message?.toString() ??
            exception.message;

      reply.status(status).send({ error: message });
    } else {
      const message =
        exception instanceof Error ? exception.message : 'Internal server error';
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: message });
    }
  }
}
