import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Users } from '../../users/users.entity'

export class CreateProductDto {
  @IsNumber()
  @IsOptional()
  id?: number

  @IsString()
  @IsNotEmpty()
  brand: string

  @IsString()
  @IsNotEmpty()
  model: string

  @IsString()
  @IsNotEmpty()
  vehicle_type: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  image: string

  @IsNotEmpty()
  price: number

  @IsString()
  @IsOptional()
  motor_type: string

  @IsString()
  @IsNotEmpty()
  energy: string

  @IsString()
  @IsNotEmpty()
  transmission: string

  @IsOptional()
  power: number

  @IsOptional()
  fiscal_power: number

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
