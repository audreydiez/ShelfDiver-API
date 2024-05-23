import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { promises as fs, mkdirSync, rmSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'

@Controller('products')
@ApiBearerAuth('token')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Gets all the products stored in DB.
  @Get('all_products')
  findAll() {
    return this.productsService.findAll()
  }

  // Gets a single product stored in DB using its ID as a param.
  @Get('product/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id)
  }

  // Creates a new product.
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const tempDir = join(tmpdir(), 'uploads')
          mkdirSync(tempDir, { recursive: true })
          cb(null, tempDir)
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
          callback(null, filename)
        },
      }),
    }),
  )
  async create(
    @Request() req,
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (!file) {
      return this.productsService.create(createProductDto)
    }

    createProductDto.created_by = req.user.user_id
    const tempFilePath = file.path

    try {
      createProductDto.image = file.filename
      const product = await this.productsService.create(createProductDto)

      const finalDestination = join(
        process.cwd(),
        'uploads',
        'images',
        file.filename,
      )
      await fs.rename(tempFilePath, finalDestination)

      return product
    } catch (error) {
      console.error('Error creating product:', error)
      rmSync(tempFilePath, { force: true })
      throw error
    }
  }

  // Updates an existing product using its ID as a param.
  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const tempDir = join(tmpdir(), 'uploads')
          mkdirSync(tempDir, { recursive: true })
          cb(null, tempDir)
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
          callback(null, filename)
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    updateProductDto.updated_by = req.user.user_id
    if (!file) {
      return this.productsService.update(id, updateProductDto)
    }

    const imageName = this.findOne(id)
    const imagePath = join(
      process.cwd(),
      'uploads',
      'images',
      (await imageName).image,
    )
    try {
      unlinkSync(imagePath)
    } catch (err) {
      console.error(`Error deleting image file: ${err}`)
    }

    const tempFilePath = file.path

    try {
      updateProductDto.image = file.filename
      const product = await this.productsService.update(id, updateProductDto)

      const finalDestination = join(
        process.cwd(),
        'uploads',
        'images',
        file.filename,
      )
      await fs.rename(tempFilePath, finalDestination)

      return product
    } catch (error) {
      console.error('Error creating product:', error)
      rmSync(tempFilePath, { force: true })
      throw error
    }
  }

  // Deletes a product using its ID as a param.
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const imageName = await this.findOne(id)

    if (imageName.image === null) {
      return this.productsService.delete(id)
    }

    const imagePath = join(
      process.cwd(),
      'uploads',
      'images',
      (await imageName).image,
    )

    try {
      unlinkSync(imagePath)
    } catch (err) {
      console.error(`Error deleting image file: ${err}`)
    }
    return this.productsService.delete(id)
  }
}
