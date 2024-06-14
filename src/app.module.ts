import { Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { join } from 'path'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ProductsModule } from './products/products.module'
import { MulterModule } from '@nestjs/platform-express'
import * as mysql from 'mysql2/promise'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const connection = await mysql.createConnection({
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          user: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
        })

        await connection.query(
          `CREATE DATABASE IF NOT EXISTS \`${configService.get('DB_NAME')}\`;`,
        )
        await connection.end()

        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [join(__dirname, '**/*.entity.js')],
          synchronize: false,
          migrations: [join(__dirname, '../db/migrations/*{.ts,.js}')],
          migrationsTableName: 'migrations',
        }
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads/images',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Run migrations
      await this.dataSource.runMigrations()
      console.log('Migrations executed successfully.')
    } catch (error) {
      console.error('Error during Data Source initialization:', error)
    }
  }
}
