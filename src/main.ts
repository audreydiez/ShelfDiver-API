import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { UsersService } from './users/users.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const usersService = app.get(UsersService)

  app.setGlobalPrefix('api')
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('ShelfDiver-API')
    .setDescription('Back-end API for the ShelfDiver app, built with NestJS.')
    .setVersion('1.0')
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
