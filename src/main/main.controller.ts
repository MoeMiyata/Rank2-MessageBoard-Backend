import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class MainController {
  @Get('main')
  @Redirect('https://rank2-messageboard-frontend.onrender.com', 302)
  getMainRedirect() {
    // 必要に応じて他のロジックを追加できます
    // 例えばクエリパラメータなどを処理したい場合はここで追加することができます。
    return { url: 'https://rank2-messageboard-frontend.onrender.com' };
  }
  // 参考:https://zenn.dev/nbstsh/scraps/801f2a89bd8f93
}
