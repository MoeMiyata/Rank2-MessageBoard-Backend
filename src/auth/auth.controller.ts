import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAuth(
    @Query('user_id') name: string,
    @Query('pass') password: string, // Query('password') -> Query('pass')に変更
  ) {
    console.log('user_id:', name);
    console.log('password:', password);
    console.log('auth get');
    return await this.authService.getAuth(name, password);
  }
}
