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
    ConfigModule.forRoot({ isGlobal: true }),
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
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()

      const migrationsTableExists = await queryRunner.hasTable('migrations')
      if (migrationsTableExists) {
        const migrations = await queryRunner.query(`SELECT * FROM migrations`)
        if (migrations.length > 0) {
          console.log('Migrations have already been applied. Skipping...')
        } else {
          await this.dataSource.runMigrations()
          console.log('Migrations executed successfully.')
        }
      } else {
        await this.dataSource.runMigrations()
        console.log('Migrations executed successfully.')
      }

      await queryRunner.release()
    } catch (error) {
      console.error('Error during Data Source initialization:', error)
    }
  }
}
