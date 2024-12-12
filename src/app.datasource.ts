// import { env } from 'process';
import { DataSource } from 'typeorm';

// import dotenv from 'dotenv';
// dotenv.config();

// require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres', // データベースの種別。今回はpostgresqlへの接続とします。
  host: 'localhost',
  //   host: env.DB_HOST,
  username: 'miyatamoe',
  //   username: env.DB_NAME,
  password: 'miyatamoe',
  //   password: env.DB_PASS,
  database: 'postgres',
  //   database: env.DB_NAME,
  entities: ['src/entities/*.ts'], //  エンティティファイル（後述）配列
  migrations: ['src/migrations/*.ts'], // マイグレーションファイル（後述）配列
});

export default AppDataSource;
