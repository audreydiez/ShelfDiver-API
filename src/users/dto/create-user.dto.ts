import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator'

export class CreateUserDto {
  @IsNumber()
  @IsOptional()
  id: number

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsStrongPassword()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsOptional()
  firstname: string

  @IsString()
  @IsOptional()
  lastname: string

  @IsEnum(['ADMIN', 'CONTRIBUTOR'], {
    message: 'Valid role required',
  })
  role: 'ADMIN' | 'CONTRIBUTOR' = 'CONTRIBUTOR'

  @IsDate()
  @IsOptional()
  created_at: Date

  @IsNumber()
  @IsOptional()
  created_by: number

  @IsDate()
  @IsOptional()
  updated_at: Date

  @IsNumber()
  @IsOptional()
  updated_by: number
}
