import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { UsersService } from './users/users.service'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const usersService = app.get(UsersService)
  const configService = app.get(ConfigService)
  const allowedOrigins = configService
    .get<string>('CORS_ORIGINS')
    .split(',')
    .map((origin) => origin.trim())

  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  })

  app.setGlobalPrefix('api')
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('ShelfDiver-API')
    .setDescription('Back-end API for the ShelfDiver app, built with NestJS.')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('products')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'Bearer',
        name: 'Authorization',
        in: 'Header',
      },
      'token',
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(process.env.API_PORT)
  usersService.createDefaultUser()
}
bootstrap()
