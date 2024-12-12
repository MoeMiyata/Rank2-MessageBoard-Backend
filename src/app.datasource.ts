// import { env } from 'process';
import { DataSource } from 'typeorm';

// import dotenv from 'dotenv';
// dotenv.config();

// require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres', // データベースの種別。今回はpostgresqlへの接続とします。
  // host: 'localhost',
  host: process.env.DB_HOST,
  // username: 'miyatamoe',
  username: process.env.DB_USER,
  // password: 'miyatamoe',
  password: process.env.DB_PASS,
  // database: 'postgres',
  database: process.env.DB_NAME,
  entities: ['src/entities/*.ts'], //  エンティティファイル（後述）配列
  migrations: ['src/migrations/*.ts'], // マイグレーションファイル（後述）配列
});

export default AppDataSource;
