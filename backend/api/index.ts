import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import type { IncomingMessage, ServerResponse } from 'http';
import express from 'express';

import { AppModule } from '../src/app.module';
import { CacheInterceptor } from '../src/cache.interceptor';
import { HttpExceptionFilter } from '../src/http-exception.filter';

const server = express();
let isReady = false;

async function bootstrap(): Promise<void> {
  if (isReady) return;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn'],
  });

  app.setGlobalPrefix('api');
  app.enableCors({ origin: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new CacheInterceptor());

  await app.init();
  isReady = true;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await bootstrap();
  server(req, res);
}
