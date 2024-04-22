import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Users } from './users.entity'
import * as bcrypt from 'bcrypt'
import { randomString } from 'helpers'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  // Find all users in database.
  async findAll(): Promise<Users[]> {
    const allUsers = await this.usersRepository.find()
    return allUsers
  }

  //Find one user in database using its id.
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

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    await this.usersRepository.save(newUser)
    console.log(newUser)

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

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(updateUserDto.password, salt)
      Object.assign(userToUpdate, {
        ...updateUserDto,
        password: hashedPassword,
      })
    } else {
      Object.assign(userToUpdate, updateUserDto)
    }

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

  // Creates a default ADMIN user if there are not any users in DB.
  async createDefaultUser() {
    const count = await this.usersRepository
      .createQueryBuilder('users')
      .getCount()

    if (!count) {
      const defaultAdmin = {
        email: 'admin@mail.com',
        password: randomString(16),
        role: 'ADMIN',
      }

      const user = await this.create({
        email: defaultAdmin.email,
        password: defaultAdmin.password,
        role: defaultAdmin.role,
      })

      console.log(
        `Default admin created. Email: ${defaultAdmin.email} - Password: ${defaultAdmin.password}`,
      )
      console.log(user)

      await this.usersRepository.save(user)
    }
  }
}
