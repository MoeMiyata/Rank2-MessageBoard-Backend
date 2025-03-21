import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { typeormConfig } from './typeormConfig';
// import { MicroPost } from './entities/microposts.entity';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
// 追加（メッセージ一覧のリロード）
import { MainController } from './main/main.controller';
// 追加終了

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: 'localhost',
      // username: 'miyatamoe',
      // password: 'miyatamoe',
      // database: 'postgres',
      // host: process.env.DB_HOST,
      // username: process.env.DB_USER,
      // password: process.env.DB_PASS,
      // database: process.env.DB_NAME,
      // 以下デプロイ用
      host: 'dpg-cvecbeofnakc738d89h0-a',
      username: 'two_six',
      password: 'yukFiL9HrbbJpuIY4vpUYsDQ0t1rZtvr',
      database: 'postgresql_na6p',

      autoLoadEntities: true,
      synchronize: false,
    }),
    UserModule,
    PostModule,
    AuthModule,
  ],
  controllers: [AppController, MainController],
  providers: [AppService],
})
export class AppModule {}
