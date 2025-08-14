import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto } from './dto';
import { JwtAuthGuard } from './guards';
import { GetUser } from './decorators';
import { Usuario } from '../entities/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: Usuario): Promise<Omit<Usuario, 'senha'>> {
    const { senha, ...profile } = user;
    return profile;
  }

  @Post('validate-token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async validateToken(@GetUser() user: Usuario): Promise<{ valid: boolean; user: Omit<Usuario, 'senha'> }> {
    const { senha, ...userWithoutPassword } = user;
    return {
      valid: true,
      user: userWithoutPassword,
    };
  }
}
