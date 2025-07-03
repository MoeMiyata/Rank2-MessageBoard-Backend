import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, MoreThan } from 'typeorm';
import { MicroPost } from '../entities/microposts.entity';
import { Auth } from '../entities/auth.entity';

import { spawn } from 'child_process';
import { join } from 'path';

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

  // async extractKeywords(message: string) {
  //   try {
  //     const response = await axios.post(
  //       'http://localhost:5005/extract_keywords',
  //       { message },
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error('Flaskサーバとの通信エラー:', error);
  //     return [];
  //   }
  // }
  async extractKeywords(text: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      // NestJSのサービスファイルとPythonスクリプトの位置関係を正確に指定
      const scriptPath = join(
        process.cwd(),
        'src',
        'post',
        'pythonAPI',
        'keyBERT.py',
      );
      const python = spawn('python3', [scriptPath]);

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0 || error) {
          return reject(`Python error: ${error}`);
        }
        try {
          const keywords = JSON.parse(output);
          resolve(keywords);
        } catch (err) {
          console.log(err);
          reject('JSON parse error');
        }
      });

      // 投稿内容をPythonスクリプトに送信
      python.stdin.write(text);
      python.stdin.end();
    });
  }

  // GETリクエストに対して作成
  async getList(
    token: string,
    start: number = 0,
    nr_records: number = 1,
    keyword: string = '',
  ) {
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

    // keywordが指定されている場合、contentに対してLIKE検索を追加
    if (keyword) {
      qb.andWhere('micro_post.content LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

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

  // DELETEリクエストに対して作成
  async deletePost(token: string, deleteid: number) {
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

    await this.microPostsRepository.delete({ id: deleteid });
  }

  // PUTリクエストに対して作成
  async updatePost(token: string, id: number, content: string) {
    console.log('In updatePost');

    //ログイン済みかチェック
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

    const post = await this.microPostsRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    console.log('post(updatePost):', post); //編集するユーザ情報を持ってきた

    // 更新するデータ（undefined のプロパティを削除）
    const updateData: Partial<MicroPost> = {};

    console.log('updateData:', updateData);

    if (content !== '') {
      updateData.content = content;
    }
    console.log('updateData(updatePost):', updateData); //編集するユーザ情報を持ってきた

    // ユーザー情報を保存
    await this.microPostsRepository.update(id, updateData);
  }
}
