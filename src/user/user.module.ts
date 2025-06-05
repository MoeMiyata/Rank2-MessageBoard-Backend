import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Auth } from '../entities/auth.entity';

import { JwtModule } from '@nestjs/jwt'; // ← 追加
import { MailService } from '../mail/mail.service'; // ← 追加
import { Token } from 'src/entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth, Token]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'Yf9!kPz6#QsL2v@Rm8TnC$1WbXeVz9dA', // .envから秘密鍵を取得
      signOptions: { expiresIn: '15m' }, // 任意の有効期限を設定
    }),
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule {}
