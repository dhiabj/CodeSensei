import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';
import { getEmailVerificationTemplate } from './templates/email-verification';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private brevo: BrevoClient;

  constructor(private configService: ConfigService) {
    this.brevo = new BrevoClient({
      apiKey: this.configService.getOrThrow<string>('BREVO_API_KEY'),
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationToken: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
    const htmlContent = getEmailVerificationTemplate(verificationLink);

    try {
      const result = await this.brevo.transactionalEmails.sendTransacEmail({
        subject: 'Verify Your Email Address',
        htmlContent,
        sender: {
          name: this.configService.getOrThrow<string>('BREVO_SENDER_NAME'),
          email: this.configService.getOrThrow<string>('BREVO_SENDER_EMAIL'),
        },
        to: [{ email }],
      });
      this.logger.log(`Verification email sent to ${email}`, result);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  }
}
