import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Users } from './users.entity'

describe('UsersService', () => {
  let service: UsersService
  let repository: Repository<Users>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    repository = module.get<Repository<Users>>(getRepositoryToken(Users))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'john@example.com',
          password: 'password123',
          firstname: 'John',
          lastname: 'Doe',
          role: 'ADMIN',
          created_at: new Date('2023-06-01T10:00:00Z'),
          updated_at: new Date('2023-06-01T10:00:00Z'),
          created_by: null,
          updated_by: null,
        },
        {
          id: 2,
          email: 'jane@example.com',
          password: 'password456',
          firstname: 'Jane',
          lastname: 'Smith',
          role: 'CONTRIBUTOR',
          created_at: new Date('2023-06-02T12:00:00Z'),
          updated_at: new Date('2023-06-02T12:00:00Z'),
          created_by: null,
          updated_by: null,
        },
      ]

      jest.spyOn(repository, 'find').mockResolvedValue(mockUsers)

      const result = await service.findAll()

      expect(repository.find).toHaveBeenCalled()
      expect(result).toEqual(mockUsers)
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
        role: 'ADMIN',
        created_at: new Date('2023-06-01T10:00:00Z'),
        updated_at: new Date('2023-06-01T10:00:00Z'),
        created_by: null,
        updated_by: null,
      }

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser)

      const result = await service.findOne(1)

      expect(repository.findOne).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
    })
  })
})
