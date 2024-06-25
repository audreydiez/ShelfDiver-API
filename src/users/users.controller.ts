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
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller('users')
@ApiBearerAuth('token')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Gets all the users stored in DB. Must be a logged in ADMIN to access this route.
  @UseGuards(JwtAuthGuard)
  @Get('all_users')
  findAll(@Request() req) {
    if (req.user.user_role != 'ADMIN') {
      throw new HttpException(
        'Invalid authentication level',
        HttpStatus.FORBIDDEN,
      )
    }
    return this.usersService.findAll()
  }

  // Gets a single user stored in DB using its ID as a param. Must be a logged in ADMIN to access this route.
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    if (req.user.user_role != 'ADMIN') {
      throw new HttpException(
        'Invalid authentication level',
        HttpStatus.FORBIDDEN,
      )
    }
    return this.usersService.findOne(id)
  }

  // Creates a new user. Must be a logged in ADMIN to access this route.
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Request() req, @Body(ValidationPipe) createUserDto: CreateUserDto) {
    if (req.user.user_role != 'ADMIN') {
      throw new HttpException(
        'Invalid authentication level',
        HttpStatus.FORBIDDEN,
      )
    }
    createUserDto.created_by = req.user.user_id
    return this.usersService.create(createUserDto)
  }

  // Updates an existing user using its ID as a param. Must be a logged in ADMIN to access this route.
  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    updateUserDto.updated_by = req.user.user_id

    if (req.user.user_role != 'ADMIN') {
      throw new HttpException(
        'Invalid authentication level',
        HttpStatus.FORBIDDEN,
      )
    }
    return this.usersService.update(id, updateUserDto)
  }

  // Deletes an user using its ID as a param. Must be a logged in ADMIN to access this route.
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  delete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    if (req.user.user_role != 'ADMIN') {
      throw new HttpException(
        'Invalid authentication level',
        HttpStatus.FORBIDDEN,
      )
    }
    return this.usersService.delete(id)
  }
}
