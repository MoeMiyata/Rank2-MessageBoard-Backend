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
  host: 'dpg-cuqirrd2ng1s73afqqs0-a',
  username: 'two_six',
  password: 'h8rcdtLW3Zm3FOaKzM7OdmL6DY05G5i4',
  database: 'postgressql_y1ro',
  entities: ['src/entities/*.ts'], //  エンティティファイル（後述）配列
  migrations: ['src/migrations/*.ts'], // マイグレーションファイル（後述）配列
});

export default AppDataSource;
