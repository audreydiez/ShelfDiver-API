import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Users } from './users.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    const allUsers = await this.usersRepository.find()
    return allUsers
  }

  async findOne(id: number): Promise<Users> {
    const userById = await this.usersRepository.findOneBy({ id })
    if (!userById) {
      throw new HttpException(
        'No such user found in Database',
        HttpStatus.NOT_FOUND,
      )
    }

    return userById
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt)

    const newUser = {
      ...createUserDto,
      password: hashedPassword,
    }

    await this.usersRepository.save(newUser)

    return newUser
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const userToUpdate = await this.usersRepository.findOne({ where: { id } })

    if (!userToUpdate) {
      throw new HttpException(
        'No such user found in Database',
        HttpStatus.NOT_FOUND,
      )
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(updateUserDto.password, salt)

    Object.assign(userToUpdate, {
      ...updateUserDto,
      password: hashedPassword,
    })

    await this.usersRepository.save(userToUpdate)

    return userToUpdate
  }

  async delete(id: number): Promise<void> {
    const userToDelete = await this.usersRepository.findOne({
      where: { id },
    })
    await this.usersRepository.delete(id)
    if (!userToDelete) {
      throw new HttpException(
        'No such user found in Database',
        HttpStatus.NOT_FOUND,
      )
    }
  }
}
