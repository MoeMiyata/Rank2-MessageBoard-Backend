import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MicroPost } from '../entities/microposts.entity';
import { Auth } from '../entities/auth.entity';
import { KeywordLinks } from 'src/entities/keywordlinks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MicroPost, Auth, KeywordLinks])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
