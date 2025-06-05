import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendMail(to: string, subject: string, content: string): Promise<void> {
    try {
      const result = await this.resend.emails.send({
        from: 'MicroPost@resend.dev', // Resendで検証済みのドメインが必要
        to,
        subject,
        html: `<p>${content}</p>`,
      });

      console.log('📨 Sent mail:', result);
    } catch (err) {
      console.error('❌ Failed to send mail:', err);
      throw err;
    }
  }
}
