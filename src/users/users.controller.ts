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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller('users')
@ApiBearerAuth('token')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    if (req.user.user_role != 'ADMIN') {
      throw new HttpException(
        'Invalid authentication level',
        HttpStatus.FORBIDDEN,
      )
    }
    return this.usersService.update(id, updateUserDto)
  }

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
