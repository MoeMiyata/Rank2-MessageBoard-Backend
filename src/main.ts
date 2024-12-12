import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000; // 環境変数から使用ポートを取得

  // CROS policy解決のため挿入
  app.enableCors({
    origin: '*',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });

  // await app.listen(process.env.PORT ?? 3000);
  console.log(`linstening on port ${port}`);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
