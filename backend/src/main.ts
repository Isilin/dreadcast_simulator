import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { CacheInterceptor } from './cache.interceptor';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
  await app.register(
    (await import('@fastify/cors')).default,
    { origin: true },
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new CacheInterceptor());

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend démarré sur http://localhost:${port}`);
}

bootstrap();
