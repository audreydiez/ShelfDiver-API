import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from './auth.service'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login route using an email and a password as credentials.
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  // Returns the user bound to the JWT from the DB. Must be logged in to access this route.
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
