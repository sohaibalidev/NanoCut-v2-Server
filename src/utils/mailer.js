const { Resend } = require('resend');
const config = require('../config/app.config');

class EmailService {
  constructor() {
    this.resend = new Resend(config.RESEND_API_KEY);
    this.from = config.EMAIL_FROM || 'NanoCut <onboarding@resend.dev>';
    this.initializeService();
  }

  initializeService() {
    if (!config.RESEND_API_KEY) {
      console.warn('[MAILER] Resend API key missing. Email functionality disabled.');
      this.resend = null;
      return;
    }

    console.log('[MAILER] Resend service initialized');
  }

  async send({ to, subject, text, html }) {
    if (!this.resend) {
      console.warn('[MAILER] Email service disabled - no API key configured');
      return { id: 'disabled' };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        text,
        html,
      });

      if (error) {
        throw new Error(`Resend error: ${error.message}`);
      }

      console.log(`[MAILER] Email sent to ${to}: ${subject}`);
      return data;
    } catch (error) {
      console.error('[MAILER] Send failed:', error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  generateLoginEmailTemplate(email, loginToken) {
    const loginUrl = `${config.FRONTEND_URL}/auth/verify?token=${loginToken}`;
    const appName = config.APP_NAME || 'NanoCut';
    const currentYear = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Login Link - ${appName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #0a0a0a;
            color: #ffffff;
        }
        
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #111111;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
            padding: 40px 30px 30px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            color: #d4af37;
            margin-bottom: 8px;
        }
        
        .email-content {
            padding: 40px 30px;
        }
        
        .email-title {
            font-size: 28px;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
            margin-bottom: 24px;
        }
        
        .message {
            color: #b8b8b8;
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.7;
        }
        
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        
        .login-button {
            display: inline-block;
            background-color: #d4af37;
            color: #1a1a1a;
            text-decoration: none;
            padding: 16px 40px;
            font-weight: 600;
            font-size: 16px;
            border-radius: 5px;
            min-width: 200px;
        }
        
        .code-block {
            background-color: #0a0a0a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px 20px;
            font-family: monospace;
            font-size: 14px;
            color: #b8b8b8;
            word-break: break-all;
            line-height: 1.5;
        }
        
        .warning-box {
            background: rgba(229, 57, 53, 0.1);
            border: 1px solid rgba(229, 57, 53, 0.3);
            padding: 20px 24px;
            margin: 32px 0;
        }
        
        .warning-text {
            color: #e53935;
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
        }
        
        .email-footer {
            padding: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            color: #888888;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <div class="logo">${appName}</div>
        </div>
        
        <div class="email-content">
            <h1 class="email-title">Your Secure Login Link</h1>
            
            <p class="message">Hello,</p>
            
            <p class="message">You requested a secure login link for your <strong>${appName}</strong> account. Click the button below to sign in securely:</p>
            
            <div class="button-container">
                <a href="${loginUrl}" class="login-button">Sign In to ${appName}</a>
            </div>
            
            <p class="message">Or copy and paste this link in your browser:</p>
            <div class="code-block">${loginUrl}</div>
            
            <div class="warning-box">
                <p class="warning-text">This login link will expire in 15 minutes for your protection.</p>
            </div>
        </div>
        
        <div class="email-footer">
            <p>&copy; ${currentYear} ${appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  async sendLoginEmail(email, loginToken) {
    const subject = `Your Login Link - ${config.APP_NAME || 'NanoCut'}`;
    const html = this.generateLoginEmailTemplate(email, loginToken);
    const text = `Login to NanoCut: ${config.FRONTEND_URL}/auth/verify?token=${loginToken}\n\nThis link expires in 15 minutes.`;

    return await this.send({
      to: email,
      subject,
      text,
      html,
    });
  }
}

module.exports = new EmailService();
