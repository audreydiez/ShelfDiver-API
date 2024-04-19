import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator'
import { Users } from '../users.entity'

export class CreateUserDto {
  @IsNumber()
  @IsOptional()
  id?: number

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsStrongPassword()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsOptional()
  firstname?: string

  @IsString()
  @IsOptional()
  lastname?: string

  @IsString()
  @IsOptional()
  role?: string

  @IsDate()
  @IsOptional()
  created_at?: Date

  @IsNumber()
  @IsOptional()
  created_by?: Users

  @IsDate()
  @IsOptional()
  updated_at?: Date

  @IsNumber()
  @IsOptional()
  updated_by?: Users
}
