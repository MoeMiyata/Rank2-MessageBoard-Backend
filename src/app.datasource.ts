// import { env } from 'process';
import { DataSource } from 'typeorm';

// import dotenv from 'dotenv';
// dotenv.config();

// require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres', // データベースの種別。今回はpostgresqlへの接続とします。
  // host: process.env.DB_HOST,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // database: process.env.DB_NAME,
  // host: 'localhost',
  // username: 'miyatamoe',
  // password: 'miyatamoe',
  // database: 'postgres',
  // 以下デプロイ用
  host: 'dpg-cu2vdl9opnds73803i0g-a',
  username: 'rank2_messageboard_postgresql_user',
  password: 'G81dAug0KTPYQU5qiYDu27VS4LqZvXv1',
  database: 'rank2_messageboard_postgresql',
  entities: ['src/entities/*.ts'], //  エンティティファイル（後述）配列
  migrations: ['src/migrations/*.ts'], // マイグレーションファイル（後述）配列
});

export default AppDataSource;
