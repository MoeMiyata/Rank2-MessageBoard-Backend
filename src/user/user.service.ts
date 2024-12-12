import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, MoreThan } from 'typeorm';
import { User } from '../entities/user.entity';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  // POSTリクエストに対して作成
  createUser(name: string, email: string, password: string) {
    const hash = createHash('md5').update(password).digest('hex');
    const record = {
      name: name,
      email: email,
      hash: hash,
    };
    this.userRepository.save(record);
  }

  // GETリクエストに対して作成
  async getUser(token: string, id: number) {
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

    const user = await this.userRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    console.log('user(getUser):', user);

    return user;
  }
}
