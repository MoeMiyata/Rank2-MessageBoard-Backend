import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { typeormConfig } from './typeormConfig';
// import { MicroPost } from './entities/microposts.entity';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';

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
      // 以下でデプロイ用
      host: 'dpg-ctd69pm8ii6s738v2np0-a',
      username: 'twosix',
      password: 'YnT8gCisClIVUSmVT1UuNjnOWIgxSSPW',
      database: 'twosix_ko4d',

      autoLoadEntities: true,
      synchronize: false,
    }),
    UserModule,
    PostModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
