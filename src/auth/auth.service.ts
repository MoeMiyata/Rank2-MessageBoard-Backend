import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { User } from '../entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async getAuth(name: string, password: string) {
    // name, passwordからUserレコード検索
    if (!password) {
      throw new UnauthorizedException(); // パスワードが指定されていない場合は認証失敗
    }
    const hash = crypto.createHash('md5').update(password).digest('hex');
    const user = await this.userRepository.findOne({
      where: {
        name: Equal(name),
        hash: Equal(hash),
      },
    });

    console.log('user:', user);
    // 見つからなければ認証失敗
    if (!user) {
      throw new UnauthorizedException();
    }

    const ret = {
      token: '',
      user_id: user.id,
    };

    // 認証レコード作成
    const expire = new Date(); // var->const変更
    expire.setDate(expire.getDate() + 1);
    const auth = await this.authRepository.findOne({
      where: {
        user_id: Equal(user.id),
      },
    });

    if (auth) {
      // 更新
      if (new Date(auth.expire_at) < new Date()) {
        // 期限切れ → トークン再生成
        auth.token = crypto.randomBytes(32).toString('hex');
      }
      auth.expire_at = expire;
      await this.authRepository.save(auth);
      ret.token = auth.token;
    } else {
      // 挿入
      const token = crypto.randomBytes(32).toString('hex');
      const record = {
        user_id: user.id,
        token: token,
        expire_at: expire.toISOString(),
      };
      await this.authRepository.save(record);
      ret.token = token;
    }
    return ret;
  }
}
