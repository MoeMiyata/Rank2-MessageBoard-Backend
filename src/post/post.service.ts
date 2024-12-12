import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, MoreThan } from 'typeorm';
import { MicroPost } from '../entities/microposts.entity';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(MicroPost)
    private microPostsRepository: Repository<MicroPost>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  // POSTリクエストに対して作成
  async createPost(message: string, token: string) {
    // ログイン済みかチェック
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: {
        token: Equal(token),
        expire_at: MoreThan(now),
      },
    });

    if (!auth) {
      throw new ForbiddenException();
    }

    const record = {
      user_id: auth.user_id,
      content: message,
    };

    await this.microPostsRepository.save(record);
  }

  // GETリクエストに対して作成
  async getList(token: string, start: number = 0, nr_records: number = 1) {
    // ログイン済みかチェック
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: {
        token: Equal(token),
        expire_at: MoreThan(now),
      },
    });

    if (!auth) {
      throw new ForbiddenException();
    }

    const qb = await this.microPostsRepository
      .createQueryBuilder('micro_post')
      .leftJoinAndSelect('user', 'user', 'user.id=micro_post.user_id')
      .select([
        'micro_post.id as id',
        'user.name as user_name',
        'micro_post.content as content',
        'micro_post.created_at as created_at',
      ])
      .orderBy('micro_post.created_at', 'DESC')
      .offset(start)
      .limit(nr_records);

    type ResultType = {
      id: number;
      content: string;
      user_name: string;
      created_at: Date;
    };

    const records = await qb.getRawMany<ResultType>();
    console.log('records:', records);

    return records;
  }
}
