import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Users } from './users.entity'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto'

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

    service = await module.resolve<UsersService>(UsersService)
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

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'password789',
        firstname: 'New',
        lastname: 'User',
        role: 'CONTRIBUTOR',
      }

      const salt = 'salt123'
      const hashedPassword = 'hashedPassword123'
      const savedUser = {
        id: 3,
        ...newUser,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: null,
        updated_by: null,
      }

      jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(() => Promise.resolve(salt))
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword))
      jest.spyOn(repository, 'create').mockReturnValue(savedUser)
      jest.spyOn(repository, 'save').mockResolvedValue(savedUser)

      const result = await service.create(newUser)

      expect(bcrypt.genSalt).toHaveBeenCalled()
      expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, salt)
      expect(repository.create).toHaveBeenCalledWith({
        ...newUser,
        password: hashedPassword,
      })
      expect(repository.save).toHaveBeenCalledWith(savedUser)
      expect(result).toEqual(savedUser)
    })
  })

  describe('update', () => {
    it('should update an existing user without changing the password', async () => {
      const updatedUser = {
        id: 1,
        email: 'john@example.com',
        password: 'password789',
        firstname: 'John',
        lastname: 'Doe',
        role: 'ADMIN',
        created_at: new Date('2023-06-01T10:00:00Z'),
        updated_at: new Date('2023-06-01T10:00:00Z'),
        created_by: null,
        updated_by: null,
      }

      const updateUserDto: UpdateUserDto = {
        email: 'john@example.com',
        firstname: 'John',
        lastname: 'Doe',
        role: 'ADMIN',
      }

      jest.spyOn(repository, 'findOne').mockResolvedValue(updatedUser)
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser)

      const result = await service.update(1, updateUserDto)

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(repository.save).toHaveBeenCalledWith(updatedUser)
      expect(result).toEqual(updatedUser)
    })

    it('should update an existing user with a new hashed password', async () => {
      const updatedUser = {
        id: 1,
        email: 'john@example.com',
        password: 'hashedPassword123',
        firstname: 'John',
        lastname: 'Doe',
        role: 'ADMIN',
        created_at: new Date('2023-06-01T10:00:00Z'),
        updated_at: new Date('2023-06-01T10:00:00Z'),
        created_by: null,
        updated_by: null,
      }

      const updateUserDto: UpdateUserDto = {
        email: 'john@example.com',
        password: 'newpassword',
        firstname: 'John',
        lastname: 'Doe',
        role: 'ADMIN',
      }

      const salt = 'salt123'
      const hashedPassword = 'hashedPassword123'

      jest.spyOn(repository, 'findOne').mockResolvedValue(updatedUser)
      jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(() => Promise.resolve(salt))
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword))
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser)

      const result = await service.update(1, updateUserDto)

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(bcrypt.genSalt).toHaveBeenCalled()
      expect(bcrypt.hash).toHaveBeenCalledWith(updateUserDto.password, salt)
      expect(repository.save).toHaveBeenCalledWith({
        ...updatedUser,
        password: hashedPassword,
      })
      expect(result).toEqual(updatedUser)
    })
  })

  describe('delete', () => {
    it('should remove an existing non-admin user', async () => {
      const userId = 1
      const userToDelete = {
        id: userId,
        email: 'john@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
        role: 'CONTRIBUTOR',
        created_at: new Date('2023-06-01T10:00:00Z'),
        updated_at: new Date('2023-06-01T10:00:00Z'),
        created_by: null,
        updated_by: null,
      }

      const deleteResult = { affected: 1, raw: null }

      jest.spyOn(repository, 'findOne').mockResolvedValue(userToDelete)
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult)

      await service.delete(userId)

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } })
      expect(repository.delete).toHaveBeenCalledWith(userId)
    })

    it('should throw an error when trying to delete an admin user', async () => {
      const userId = 2
      const adminUser = {
        id: userId,
        email: 'admin@example.com',
        password: 'adminpassword',
        firstname: 'Admin',
        lastname: 'User',
        role: 'ADMIN',
        created_at: new Date('2023-06-02T12:00:00Z'),
        updated_at: new Date('2023-06-02T12:00:00Z'),
        created_by: null,
        updated_by: null,
      }

      jest.spyOn(repository, 'findOne').mockResolvedValue(adminUser)

      await expect(service.delete(userId)).rejects.toThrow(
        'Cannot delete an ADMIN user!',
      )
    })
  })
})
