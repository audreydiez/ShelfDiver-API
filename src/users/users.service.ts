import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Users } from './users.entity'
import * as bcrypt from 'bcrypt'
import { randomString } from '../helpers'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  // Finds all users in database.
  async findAll(): Promise<Users[]> {
    const allUsers = await this.usersRepository.find()
    return allUsers
  }

  //Finds one user in database using its id.
  async findOne(id: number): Promise<Users> {
    const userById = await this.usersRepository.findOne({
      where: { id },
      relations: ['created_by', 'updated_by'],
    })
    if (!userById) {
      throw new HttpException(
        'No such user found in Database',
        HttpStatus.NOT_FOUND,
      )
    }
    // Mapping only the names of the users
    const { created_by, updated_by, ...rest } = userById
    const result = {
      ...rest,
      created_by: created_by
        ? { firstname: created_by.firstname, lastname: created_by.lastname }
        : null,
      updated_by: updated_by
        ? { firstname: updated_by.firstname, lastname: updated_by.lastname }
        : null,
    }
    return result as Users
  }

  // Creates a new user.
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

  // Update an existing user using its id.
  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const userToUpdate = await this.usersRepository.findOne({ where: { id } })

    if (!userToUpdate) {
      throw new HttpException(
        'No such user found in Database',
        HttpStatus.NOT_FOUND,
      )
    }

    // If a new password is provided, hashes it before saving it.
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

  // Deletes an user using its id.
  async delete(id: number): Promise<void> {
    const userToDelete = await this.usersRepository.findOne({
      where: { id },
    })
    if (!userToDelete) {
      throw new HttpException(
        'No such user found in Database',
        HttpStatus.NOT_FOUND,
      )
    }
    if (userToDelete.role === 'ADMIN') {
      throw new HttpException(
        'Cannot delete an ADMIN user!',
        HttpStatus.FORBIDDEN,
      )
    }
    await this.usersRepository.delete(id)
  }

  // Creates a default ADMIN user if there are not any users in DB.
  async createDefaultUser() {
    // Checks if there is any user stored in DB.
    const count = await this.usersRepository
      .createQueryBuilder('users')
      .getCount()

    // If no users are stored in DB, creates one using a placeholder email and a randomized password.
    if (!count) {
      const defaultAdmin = {
        email: 'admin@mail.com',
        password: randomString(16),
        role: 'ADMIN',
        firstname: 'John',
        lastname: 'Doe',
      }

      const user = await this.create({
        email: defaultAdmin.email,
        password: defaultAdmin.password,
        role: defaultAdmin.role,
        firstname: defaultAdmin.firstname,
        lastname: defaultAdmin.lastname,
      })

      // Returns the credentials needed to access the dashboard.
      console.log(
        `Default admin created. Email: ${defaultAdmin.email} - Password: ${defaultAdmin.password}`,
      )
      console.log(user)

      await this.usersRepository.save(user)
    }
  }
}
