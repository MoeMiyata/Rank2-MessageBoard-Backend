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
import { Token } from '../entities/token.entity';

import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,

    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,

    private readonly jwtService: JwtService, // ← これを追加
    private readonly mailService: MailService, // ← これを追加！
  ) {}

  async requestEmailVerification(
    name: string,
    email: string,
    password: string,
    ip?: string,
  ) {
    const usedName = await this.userRepository.findOne({ where: { name } });
    const usedEmail = await this.userRepository.findOne({ where: { email } });

    if (usedName)
      throw new BadRequestException('このユーザー名は既に使われています');
    if (usedEmail)
      throw new BadRequestException('このメールアドレスは既に登録済みです');

    const token = this.jwtService.sign(
      { name, email, password },
      { expiresIn: '15m' },
    );

    await this.tokenRepository.save({
      email,
      token,
      expire_at: new Date(Date.now() + 15 * 60 * 1000),
      ip,
    });

    const verifyUrl = `https://rank2-messageboard-frontend.onrender.com/verify-email?token=${token}`;
    console.log(verifyUrl);

    await this.mailService.sendMail(
      email,
      '【認証】メールアドレス確認',
      `${name}様<br><br>
      ユーザ登録いただき誠にありがとうございます。<br>
      アカウントを有効化するために、以下のURLにアクセスしてください。<br><br>
      <a href="${verifyUrl}" target="_blank">${verifyUrl}</a><br><br>
      ※このURLは15分間のみ有効です。<br><br>
      MicroPost運営チーム`,
    );

    return { message: '確認メールを送信しました。' };
  }

  // async verifyAndCreateUser(token: string) {
  //   const record = await this.tokenRepository.findOne({ where: { token } });
  //   if (!record || record.used || record.expire_at < new Date()) {
  //     throw new BadRequestException(
  //       '無効または使用済み・期限切れのトークンです',
  //     );
  //   }

  //   try {
  //     const payload = this.jwtService.verify(token);

  //     const usedEmail = await this.userRepository.findOne({
  //       where: { email: payload.email },
  //     });
  //     if (usedEmail) {
  //       throw new BadRequestException(
  //         'このメールアドレスは既に登録されています',
  //       );
  //     }

  //     const hash = createHash('md5').update(payload.password).digest('hex');
  //     const newUser = {
  //       name: payload.name,
  //       email: payload.email,
  //       hash: hash,
  //     };

  //     await this.userRepository.save(newUser);

  //     // トークンを使用済みに更新
  //     record.used = true;
  //     await this.tokenRepository.save(record);

  //     return { message: 'ユーザー登録が完了しました。' };
  //   } catch (err) {
  //     throw new BadRequestException('トークン検証中にエラーが発生しました');
  //     console.error('エラー:', err);
  //   }
  // }
  async verifyEmail(token: string) {
    const record = await this.tokenRepository.findOne({ where: { token } });
    if (!record || record.used || record.expire_at < new Date()) {
      throw new BadRequestException(
        '無効または使用済み・期限切れのトークンです',
      );
    }

    try {
      const payload = this.jwtService.verify(token);

      // 使用済みフラグは createUser 側で更新するためここでは残す
      return { payload, record };
    } catch (err) {
      console.error('トークン検証エラー:', err);
      throw new BadRequestException('トークン検証中にエラーが発生しました');
    }
  }

  async createUser(
    payload: { name: string; email: string; password: string },
    record: Token,
  ) {
    const usedEmail = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (usedEmail) {
      throw new BadRequestException('このメールアドレスは既に登録されています');
    }

    const hash = createHash('md5').update(payload.password).digest('hex');

    const newUser = {
      name: payload.name,
      email: payload.email,
      hash: hash,
    };

    await this.userRepository.save(newUser);

    // トークンを使用済みに更新
    record.used = true;
    await this.tokenRepository.save(record);

    return { message: 'ユーザー登録が完了しました。' };
  }

  // // POSTリクエストに対して作成
  // async createUser(name: string, email: string, password: string) {
  //   const hash = createHash('md5').update(password).digest('hex');
  //   const record = {
  //     name: name,
  //     email: email,
  //     hash: hash,
  //   };

  //   const usedUserName = await this.userRepository.findOne({
  //     where: {
  //       name: Equal(name),
  //     },
  //   });
  //   const usedUserEmail = await this.userRepository.findOne({
  //     where: {
  //       email: Equal(email),
  //     },
  //   });

  //   console.log('usedUserName:', usedUserName);
  //   console.log('usedUserEmail:', usedUserEmail);

  //   if (usedUserName) {
  //     throw new BadRequestException('このユーザー名はすでに使用されています．');
  //   }

  //   if (usedUserEmail) {
  //     throw new BadRequestException(
  //       'このメールアドレスはすでに使用されています．',
  //     );
  //   }

  //   // ユーザー情報を保存
  //   await this.userRepository.save(record);
  // }

  async requestChangePassword(
    token: string,
    id: number,
    name: string,
    email: string,
  ) {
    const user = await this.userRepository.findOne({ where: { name, email } });
    if (!user) {
      throw new BadRequestException('指定されたユーザーが存在しません');
    }

    const jwt = this.jwtService.sign(
      { token, id, name, email },
      { expiresIn: '15m' },
    );

    await this.tokenRepository.save({
      email,
      token: jwt,
      expire_at: new Date(Date.now() + 15 * 60 * 1000),
    });

    const verifyUrl = `https://rank2-messageboard-frontend.onrender.com/change-password?token=${jwt}`;
    console.log(verifyUrl);

    await this.mailService.sendMail(
      email,
      '【重要】パスワード再設定のお願い',
      `${name}様<br><br>
      以下のURLからパスワードを再設定してください。<br><br>
      <a href="${verifyUrl}" target="_blank">${verifyUrl}</a><br><br>
      ※このURLは15分間のみ有効です。<br><br>
      MicroPost運営チーム`,
    );

    return { message: '再設定メールを送信しました。' };
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
    record?: Token,
    name?: string,
    email?: string,
    password?: string,
    birthday?: string,
    address?: string,
    tel?: string,
    imgSrc?: string,
  ) {
    console.log('In updateUser');

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

    if (record) {
      // トークンを使用済みに更新
      record.used = true;
      await this.tokenRepository.save(record);
    }
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
