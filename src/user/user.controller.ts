import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async createUser(
  //   @Body('name') name: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return await this.userService.createUser(name, email, password);
  // }

  @Post('request-verification')
  async requestEmailVerification(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.requestEmailVerification(name, email, password);
  }

  // @Post('verify-email')
  // async verifyAndCreateUser(@Body() body: { token: string }) {
  //   return this.userService.verifyAndCreateUser(body.token);
  // }
  @Post('verify-email')
  async verifyAndCreateUser(@Body('token') token: string) {
    const { payload, record } = await this.userService.verifyEmail(token);
    return await this.userService.createUser(payload, record);
  }

  // パスワード再設定
  @Post('change-password')
  async requestChangePassword(
    @Body('token') token: string,
    @Body('name') name: string,
    @Body('email') email: string,
  ) {
    return this.userService.requestChangePassword(token, name, email);
  }

  @Post('verify-password')
  async verifyPassword(@Body('token') jwt: string) {
    const { payload, record } = await this.userService.verifyEmail(jwt);
    // return await this.userService.updateUser(
    //   payload.token,
    //   null,
    //   payload,
    //   record,
    // );
    return { payload, record };
  }

  // ユーザ情報取得
  @Get(':id')
  async getUser(@Param('id') id: number, @Query('token') token: string) {
    return await this.userService.getUser(token, id);
  }

  // ユーザのicon情報取得
  @Get()
  async getUserIcons(@Query('token') token: string) {
    return await this.userService.getUserIcons(token);
  }

  // ユーザ情報の編集で追加
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Query('token') token: string,

    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('birthday') birthday: string,
    @Body('address') address: string,
    @Body('tel') tel: string,
    @Body('imgSrc') imgSrc: string,
  ) {
    console.log('In back PUT(updateUser)');
    return await this.userService.updateUser(
      token,
      id,
      null,
      null,
      name,
      email,
      password,
      birthday,
      address,
      tel,
      imgSrc,
    );
  }

  @Delete()
  async deleteUser(
    @Query('token') token: string,
    @Query('user_id') user_id: number,
  ) {
    return await this.userService.deleteUser(token, user_id);
  }
}
