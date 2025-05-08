import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  // ConflictException,
  BadRequestException,
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
  // createUser(name: string, email: string, password: string) {
  //   const hash = createHash('md5').update(password).digest('hex');
  //   const record = {
  //     name: name,
  //     email: email,
  //     hash: hash,
  //   };
  //   this.userRepository.save(record);
  // }
  async createUser(name: string, email: string, password: string) {
    const hash = createHash('md5').update(password).digest('hex');
    const record = {
      name: name,
      email: email,
      hash: hash,
    };

    const usedUserName = await this.userRepository.findOne({
      where: {
        name: Equal(name),
      },
    });
    const usedUserEmail = await this.userRepository.findOne({
      where: {
        email: Equal(email),
      },
    });

    console.log('usedUserName:', usedUserName);
    console.log('usedUserEmail:', usedUserEmail);

    if (usedUserName) {
      throw new BadRequestException('このユーザー名はすでに使用されています．');
    }

    if (usedUserEmail) {
      throw new BadRequestException(
        'このメールアドレスはすでに使用されています．',
      );
    }

    // ユーザー情報を保存
    await this.userRepository.save(record);
  }

  // GETリクエストに対して作成（ユーザ情報の取得）
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

  // GETリクエストに対して作成（アイコン情報の取得）
  async getUserIcons(token: string) {
    // ログイン済みかチェック
    console.log('token(getUserIcons):', token);
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
    console.log('token:', token);

    const icons = await this.userRepository.find({
      select: ['name', 'imgSrc'],
    });
    return icons;
  }

  // ユーザ情報の編集で追加
  // PUTリクエストに対して作成
  async updateUser(
    token: string,
    id: number,
    name?: string,
    email?: string,
    password?: string,
    birthday?: string,
    address?: string,
    tel?: string,
    imgSrc?: string,
  ) {
    console.log('In updateUser');

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

    const user = await this.userRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    console.log('user(updateUser):', user); //編集するユーザ情報を持ってきた

    // 更新するデータ（undefined のプロパティを削除）
    const updateData: Partial<User> = {};

    console.log('updateData:', updateData);

    if (name && name.trim() !== '') {
      console.log('in name:', name);
      const usedUserName = await this.userRepository.findOne({
        where: {
          name: Equal(name),
        },
      });
      if (usedUserName) {
        throw new BadRequestException(
          'このユーザー名はすでに使用されています．',
        );
      }
      updateData.name = name;
    }
    if (email && email.trim() !== '') {
      console.log('in email:', email);
      const usedUserEmail = await this.userRepository.findOne({
        where: {
          email: Equal(email),
        },
      });
      if (usedUserEmail) {
        throw new BadRequestException(
          'このメールアドレスはすでに使用されています．',
        );
      }
      updateData.email = email;
    }
    if (password && password.trim() !== '') {
      // 空文字の時も登録しない
      console.log('in updateUser(password):', password);
      console.log(
        'new pass',
        (updateData.hash = createHash('md5').update(password).digest('hex')),
      );
      updateData.hash = createHash('md5').update(password).digest('hex');
    }
    if (birthday && birthday !== '') {
      console.log('birthday:', birthday); // birthdayの型等を確認
      updateData.birthday = birthday;
    }
    if (address && address.trim() !== '') {
      console.log('in address:');
      updateData.address = address;
    }
    if (tel && tel.trim() !== '') {
      console.log('in tel:');
      updateData.tel = tel;
    }
    if (imgSrc && imgSrc.trim() !== '') {
      console.log('in img_src:');
      updateData.imgSrc = imgSrc;
    }

    console.log('updateData(updateUser):', updateData); //編集するユーザ情報を持ってきた

    // ユーザー情報を保存
    await this.userRepository.update(id, updateData);
  }

  // DELETEリクエストに対して作成
  async deleteUser(token: string, user_id: number) {
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

    await this.userRepository.delete({ id: user_id });
  }
}
