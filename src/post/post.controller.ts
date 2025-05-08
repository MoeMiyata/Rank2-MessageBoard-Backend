import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body('message') message: string,
    @Query('token') token: string,
  ) {
    return await this.postService.createPost(message, token);
  }

  @Get()
  async getList(
    @Query('token') token: string,
    @Query('start') start: number,
    @Query('records') records: number,
    @Query('keyword') keyword: string,
  ) {
    return await this.postService.getList(token, start, records, keyword);
  }

  @Delete()
  async deletePost(@Query('token') token: string, @Query('id') id: number) {
    return await this.postService.deletePost(token, id);
  }

  // ユーザ情報の編集で追加
  @Put(':id')
  async updatPost(
    @Param('id') id: number,
    @Query('token') token: string,

    @Body('content') content: string,
  ) {
    console.log('In back PUT(updateUser)');
    return await this.postService.updatePost(token, id, content);
  }
}
