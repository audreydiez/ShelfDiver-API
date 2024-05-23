import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { Users } from '../users/users.entity'
import { Products } from './products.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Users, Products])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
