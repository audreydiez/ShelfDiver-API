import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductsService } from './products.service'
import { Products } from './products.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Users } from '../users/users.entity'

describe('ProductsService', () => {
  let service: ProductsService
  let repository: Repository<Products>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    repository = module.get<Repository<Products>>(getRepositoryToken(Products))
  })

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        {
          id: 1,
          brand: 'Brand 1',
          model: 'Model 1',
          vehicle_type: 'Car',
          description: 'This is a car',
          image: 'car.jpg',
          price: 10000,
          motor_type: 'Gasoline',
          energy: 'Gasoline',
          consumption: 8.5,
          transmission: 'Manual',
          power: 120,
          fiscal_power: 6,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: new Users(),
          updated_by: new Users(),
        },
        {
          id: 2,
          brand: 'Brand 2',
          model: 'Model 2',
          vehicle_type: 'Truck',
          description: 'This is a truck',
          image: 'truck.jpg',
          price: 20000,
          motor_type: 'Diesel',
          energy: 'Diesel',
          consumption: 12.0,
          transmission: 'Automatic',
          power: 180,
          fiscal_power: 8,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: new Users(),
          updated_by: new Users(),
        },
      ]
      jest.spyOn(repository, 'find').mockResolvedValue(mockProducts)

      const result = await service.findAll()

      expect(result).toEqual(mockProducts)
    })
  })

  describe('findOne', () => {
    it('should return a product', async () => {
      const mockProduct = {
        id: 1,
        brand: 'Brand 1',
        model: 'Model 1',
        vehicle_type: 'Car',
        description: 'This is a car',
        image: 'car.jpg',
        price: 10000,
        motor_type: 'Gasoline',
        energy: 'Gasoline',
        consumption: 8.5,
        transmission: 'Manual',
        power: 120,
        fiscal_power: 6,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: new Users(),
        updated_by: new Users(),
      }
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProduct)

      const result = await service.findOne(1)

      expect(result).toEqual(mockProduct)
    })

    it('should throw an error if product is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)

      await expect(service.findOne(1)).rejects.toThrow('No such product found')
    })
  })

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        brand: 'Brand 1',
        model: 'Model 1',
        vehicle_type: 'Car',
        description: 'This is a car',
        image: 'car.jpg',
        price: 10000,
        motor_type: 'Gasoline',
        energy: 'Gasoline',
        consumption: 8.5,
        transmission: 'Manual',
        power: 120,
        fiscal_power: 6,
      }
      const mockProduct = {
        id: 1,
        ...createProductDto,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: new Users(),
        updated_by: new Users(),
      }
      jest.spyOn(repository, 'create').mockReturnValue(mockProduct)
      jest.spyOn(repository, 'save').mockResolvedValue(mockProduct)

      const result = await service.create(createProductDto)

      expect(result).toEqual(mockProduct)
    })
  })

  describe('update', () => {
    it('should update an existing product', async () => {
      const mockProduct = {
        id: 1,
        brand: 'Brand 1',
        model: 'Model 1',
        vehicle_type: 'Car',
        description: 'This is a car',
        image: 'car.jpg',
        price: 10000,
        motor_type: 'Gasoline',
        energy: 'Gasoline',
        consumption: 8.5,
        transmission: 'Manual',
        power: 120,
        fiscal_power: 6,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: new Users(),
        updated_by: new Users(),
      }
      const updateProductDto: UpdateProductDto = { brand: 'Brand 2' }
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProduct)
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockProduct,
        ...updateProductDto,
      })

      const result = await service.update(1, updateProductDto)

      expect(result).toEqual({ ...mockProduct, ...updateProductDto })
    })

    it('should throw an error if product is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)
      const updateProductDto: UpdateProductDto = { brand: 'Brand 2' }

      await expect(service.update(1, updateProductDto)).rejects.toThrow(
        'No such user found in Database',
      )
    })
  })

  describe('delete', () => {
    it('should delete an existing product', async () => {
      const mockProduct = {
        id: 1,
        brand: 'Brand 1',
        model: 'Model 1',
        vehicle_type: 'Car',
        description: 'This is a car',
        image: 'car.jpg',
        price: 10000,
        motor_type: 'Gasoline',
        energy: 'Gasoline',
        consumption: 8.5,
        transmission: 'Manual',
        power: 120,
        fiscal_power: 6,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: new Users(),
        updated_by: new Users(),
      }
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProduct)
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1, raw: null })

      await expect(service.delete(1)).resolves.not.toThrow()
    })

    it('should throw an error if product is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0, raw: null })

      await expect(service.delete(1)).rejects.toThrow(
        'No such user found in Database',
      )
    })
  })
})
