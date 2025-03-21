import { Controller, Get, Post, Param, Query, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.userService.createUser(name, email, password);
  }

  @Get(':id')
  async getUser(@Param('id') id: number, @Query('token') token: string) {
    return await this.userService.getUser(token, id);
  }

  // ユーザ情報の編集で追加
  @Put()
  async updateUser(
    @Param('id') id: number,
    @Query('token') token: string,

    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('birthday') birthday: Date,
    @Body('address') address: string,
    @Body('tel') tel: string,
  ) {
    return await this.userService.updateUser(
      token,
      id,
      name,
      email,
      password,
      birthday,
      address,
      tel,
    );
  }
}
