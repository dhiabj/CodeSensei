import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import dns from 'dns';

async function bootstrap() {
  const nodeEnv = process.env.NODE_ENV;
  const isProduction = nodeEnv === 'production';

  if (!isProduction) {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
  }

  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  const apiPrefix = process.env.API_PREFIX ?? 'api';
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

  app.setGlobalPrefix(apiPrefix);

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('CodeSensei')
    .setDescription('The codesensei API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(port);

  if (!isProduction) {
    console.log(`Application running on: http://localhost:${port}`);
    console.log(`Swagger: http://localhost:${port}/docs`);
    console.log(`API: http://localhost:${port}/${apiPrefix}`);
  }
}
bootstrap();
