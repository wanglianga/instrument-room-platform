import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user) {
    const { password, ...result } = user;
    return result;
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@GetUser() user) {
    const { password, ...result } = user;
    return result;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout() {
    return { success: true };
  }
}
