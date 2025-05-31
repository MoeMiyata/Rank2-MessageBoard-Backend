import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // TLS (465) or STARTTLS (587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, content: string): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: content,
      html: `<p>${content}</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📩 Sent: ${info.messageId}`);
    } catch (err) {
      console.error(`❌ Failed to send mail:`, err);
      throw err;
    }
  }
}
