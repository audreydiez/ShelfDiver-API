import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { join } from 'path'

config()
const configService = new ConfigService()

export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [join(process.cwd(), 'dist/**/*.entity.js')],
  synchronize: false,
  migrations: [join(process.cwd(), 'db/migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
})