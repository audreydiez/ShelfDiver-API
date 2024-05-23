import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Products } from './products.entity'
import { join } from 'path'
import { createReadStream } from 'fs'
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  // Finds all products in database.
  async findAll(): Promise<Products[]> {
    const allUsers = await this.productsRepository.find()
    return allUsers
  }

  //Finds one product in database using its id.
  async findOne(id: number): Promise<Products> {
    const product = await this.productsRepository.findOneBy({ id })

    if (!product) {
      throw new HttpException('No such product found', HttpStatus.NOT_FOUND)
    }
    return product
  }

  // Creates a new product.
  async create(createProductDto: CreateProductDto): Promise<Products> {
    const newProduct = this.productsRepository.create(createProductDto)

    await this.productsRepository.save(newProduct)
    console.log(newProduct)

    return newProduct
  }

  // Update an existing product using its id.
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    const productToUpdate = await this.productsRepository.findOne({
      where: { id },
    })

    if (!productToUpdate) {
      throw new HttpException(
        'No such user found in Database',
        HttpStatus.NOT_FOUND,
      )
    }

    Object.assign(productToUpdate, updateProductDto)

    await this.productsRepository.save(productToUpdate)

    return productToUpdate
  }

  // Deletes a product using its id.
  async delete(id: number): Promise<void> {
    const productToDelete = await this.productsRepository.findOne({
      where: { id },
    })

    await this.productsRepository.delete(id)

    if (!productToDelete) {
      throw new HttpException(
        'No such user found in Database',
        HttpStatus.NOT_FOUND,
      )
    }
  }

  async getImage(image: string, res) {
    const imagePath = join(process.cwd(), 'uploads', 'images', image)
    const imageStream = createReadStream(imagePath)
    const extension = image.split('.').pop()
    const contentType = `image/${extension}`
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${image}"`,
    })
    return new StreamableFile(imageStream)
  }
}
