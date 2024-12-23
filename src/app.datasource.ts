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
  // 以下でデプロイ用
  host: 'dpg-ctd69pm8ii6s738v2np0-a',
  username: 'twosix',
  password: 'YnT8gCisClIVUSmVT1UuNjnOWIgxSSPW',
  database: 'twosix_ko4d',
  entities: ['src/entities/*.ts'], //  エンティティファイル（後述）配列
  migrations: ['src/migrations/*.ts'], // マイグレーションファイル（後述）配列
});

export default AppDataSource;
