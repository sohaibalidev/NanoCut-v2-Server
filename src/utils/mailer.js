// /**
//  * Email Service
//  * -----------------
//  * Centralized email utility powered by Nodemailer.
//  * Supports text/HTML emails, templates, and future extensibility.
//  */

// const nodemailer = require('nodemailer');
// const config = require('../config/app.config');

// class EmailService {
//   constructor() {
//     if (!config.EMAIL_USERNAME || !config.EMAIL_PASSWORD) {
//       throw new Error('Email credentials are missing in app.config');
//     }

//     this.transporter = nodemailer.createTransport({
//       service: config.EMAIL_SERVICE,
//       auth: {
//         user: config.EMAIL_USERNAME,
//         pass: config.EMAIL_PASSWORD,
//       },
//     });

//     this.transporter.verify((err) => {
//       if (err) {
//         console.error('Email server connection failed:', err.message);
//       } else {
//         console.log('[MAILER] Ready to send emails');
//       }
//     });
//   }

//   /**
//    * Send an email
//    * @param {Object} options
//    * @param {string|string[]} options.to - Recipient(s)
//    * @param {string} options.subject - Subject line
//    * @param {string} [options.text] - Plain text version
//    * @param {string} [options.html] - HTML version
//    */
//   async send({ to, subject, text, html }) {
//     const mailOptions = {
//       from: config.EMAIL_FROM,
//       to,
//       subject,
//       text,
//       html,
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log(`Email sent to ${to}: ${subject}`);
//       return info;
//     } catch (error) {
//       console.error('Email send failed:', error.message);
//       throw new Error(`Failed to send email: ${error.message}`);
//     }
//   }

//   /**
//    * Generate login email template with magic link
//    * @param {string} email - User email address
//    * @param {string} loginToken - Authentication token
//    * @returns {string} HTML email content
//    */
//   generateLoginEmailTemplate(email, loginToken) {
//     const loginUrl = `${config.FRONTEND_URL}/auth/verify?token=${loginToken}`;
//     const appName = config.APP_NAME || 'NanoCut';
//     const currentYear = new Date().getFullYear();

//     return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Your Login Link - ${appName}</title>
//     <style>
//         body {
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
//             line-height: 1.6;
//             margin: 0;
//             padding: 0;
//             background-color: #0a0a0a;
//             color: #ffffff;
//         }

//         .email-wrapper {
//             max-width: 600px;
//             margin: 0 auto;
//             background-color: #111111;
//             border: 1px solid rgba(255, 255, 255, 0.1);
//             overflow: hidden;
//             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
//         }

//         .email-header {
//             background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
//             padding: 40px 30px 30px;
//             text-align: center;
//             border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .logo {
//             font-size: 32px;
//             font-weight: 700;
//             color: white;
//             -webkit-background-clip: text;
//             -webkit-text-fill-color: transparent;
//             background-clip: text;
//             margin-bottom: 8px;
//         }

//         .tagline {
//             color: #b8b8b8;
//             font-size: 14px;
//             font-weight: 500;
//         }

//         .email-content {
//             padding: 40px 30px;
//         }

//         .email-title {
//             font-size: 28px;
//             font-weight: 600;
//             color: #ffffff;
//             text-align: center;
//             margin-bottom: 24px;
//         }

//         .message {
//             color: #b8b8b8;
//             margin-bottom: 20px;
//             font-size: 16px;
//             line-height: 1.7;
//         }

//         .button-container {
//             text-align: center;
//             margin: 32px 0;
//         }

//         .login-button {
//             display: inline-block;
//             background-color: #d4af37;
//             color: #1a1a1a;
//             text-decoration: none;
//             padding: 16px 40px;
//             font-weight: 600;
//             font-size: 16px;
//             border: none;
//             transition: all 0.3s ease;
//             box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
//             min-width: 200px;
//         }

//         .login-button:hover {
//             background-color: #c19b2e;
//             transform: translateY(-2px);
//             box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
//         }

//         .divider {
//             height: 1px;
//             background: rgba(255, 255, 255, 0.1);
//             margin: 32px 0;
//         }

//         .manual-link-section {
//             margin: 24px 0;
//         }

//         .link-label {
//             color: #b8b8b8;
//             font-size: 14px;
//             margin-bottom: 12px;
//         }

//         .code-block {
//             background-color: #0a0a0a;
//             border: 1px solid rgba(255, 255, 255, 0.1);
//             padding: 16px 20px;
//             font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
//             font-size: 14px;
//             color: #b8b8b8;
//             word-break: break-all;
//             line-height: 1.5;
//         }

//         .warning-box {
//             background: rgba(229, 57, 53, 0.1);
//             border: 1px solid rgba(229, 57, 53, 0.3);
//             padding: 20px 24px;
//             margin: 32px 0;
//         }

//         .warning-title {
//             color: #e53935;
//             font-weight: 600;
//             font-size: 14px;
//             margin-bottom: 8px;
//         }

//         .warning-text {
//             color: #e53935;
//             font-size: 14px;
//             line-height: 1.5;
//             margin: 0;
//         }

//         .email-footer {
//             padding: 30px;
//             border-top: 1px solid rgba(255, 255, 255, 0.1);
//             text-align: center;
//             color: #888888;
//             font-size: 12px;
//         }

//         .footer-text {
//             margin: 8px 0;
//             line-height: 1.5;
//         }

//         .email-address {
//             color: #d4af37;
//             font-weight: 600;
//         }

//         @media only screen and (max-width: 600px) {
//             .email-wrapper {
//                 margin: 16px 8px;
//             }

//             .email-header {
//                 padding: 30px 20px 20px;
//             }

//             .email-content {
//                 padding: 30px 20px;
//             }

//             .logo {
//                 font-size: 28px;
//             }

//             .email-title {
//                 font-size: 24px;
//             }

//             .login-button {
//                 padding: 14px 32px;
//                 width: 100%;
//                 max-width: 280px;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="email-wrapper">
//         <div class="email-header">
//             <div class="logo">${appName}</div>
//             <div class="tagline">URL Shortening Simplified</div>
//         </div>

//         <div class="email-content">
//             <h1 class="email-title">Your Secure Login Link</h1>

//             <p class="message">Hello,</p>

//             <p class="message">You requested a secure login link for your <strong style="color: #ffffff;">${appName}</strong> account. Click the button below to sign in securely:</p>

//             <div class="button-container">
//                 <a href="${loginUrl}" class="login-button">Sign In to ${appName}</a>
//             </div>

//             <div class="divider"></div>

//             <div class="manual-link-section">
//                 <p class="link-label">Or copy and paste this secure link in your browser:</p>
//                 <div class="code-block">${loginUrl}</div>
//             </div>

//             <div class="warning-box">
//                 <div class="warning-title">Security Notice</div>
//                 <p class="warning-text">This login link will expire in 15 minutes for your protection. If you didn't request this login, please disregard this email and ensure your account security.</p>
//             </div>
//         </div>

//         <div class="email-footer">
//             <p class="footer-text">This secure login link was sent to <span class="email-address">${email}</span>.</p>
//             <p class="footer-text">If you have any questions or need assistance, please contact our support team.</p>
//             <p class="footer-text">&copy; ${currentYear} ${appName}. All rights reserved.</p>
//         </div>
//     </div>
// </body>
// </html>
//     `;
//   }
//   /**
//    * Send login email with magic link authentication
//    * @param {string} email - Recipient email address
//    * @param {string} loginToken - Authentication token
//    * @returns {Promise<Object>} Nodemailer send result
//    */
//   async sendLoginEmail(email, loginToken) {
//     const subject = `Your Login Link - ${config.APP_NAME || 'NanoCut'}`;
//     const html = this.generateLoginEmailTemplate(email, loginToken);

//     const text = `Please use the following link to login:\n${config.FRONTEND_URL}/verify?token=${loginToken}\n\nThis link will expire in 15 minutes.`;

//     return await this.send({
//       to: email,
//       subject,
//       text,
//       html,
//     });
//   }
// }

// module.exports = new EmailService();

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.initializeTransporter();
  }

  initializeTransporter() {
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    };

    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('[MAILER] Email credentials missing. Email functionality disabled.');
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport(emailConfig);

    this.transporter.verify((error) => {
      if (error) {
        console.error('[MAILER] Connection failed:', error.message);
        console.warn('[MAILER] Emails will not be sent until configuration is fixed');
      } else {
        console.log('[MAILER] Ready to send emails');
      }
    });
  }

  async send({ to, subject, text, html }) {
    if (!this.transporter) {
      console.warn('[MAILER] Email service disabled - no transporter configured');
      return { messageId: 'disabled' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"NanoCut" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[MAILER] Email sent to ${to}: ${subject}`);
      return info;
    } catch (error) {
      console.error('[MAILER] Send failed:', error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  generateLoginEmailTemplate(email, loginToken) {
    const loginUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${loginToken}`;
    const appName = process.env.APP_NAME || 'NanoCut';
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
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
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
            color: white;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
        }
        
        .tagline {
            color: #b8b8b8;
            font-size: 14px;
            font-weight: 500;
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
            border: none;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
            min-width: 200px;
        }
        
        .login-button:hover {
            background-color: #c19b2e;
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
        }
        
        .divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: 32px 0;
        }
        
        .manual-link-section {
            margin: 24px 0;
        }
        
        .link-label {
            color: #b8b8b8;
            font-size: 14px;
            margin-bottom: 12px;
        }
        
        .code-block {
            background-color: #0a0a0a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px 20px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
        
        .warning-title {
            color: #e53935;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 8px;
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
        
        .footer-text {
            margin: 8px 0;
            line-height: 1.5;
        }
        
        .email-address {
            color: #d4af37;
            font-weight: 600;
        }
        
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                margin: 16px 8px;
            }
            
            .email-header {
                padding: 30px 20px 20px;
            }
            
            .email-content {
                padding: 30px 20px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .email-title {
                font-size: 24px;
            }
            
            .login-button {
                padding: 14px 32px;
                width: 100%;
                max-width: 280px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <div class="logo">${appName}</div>
            <div class="tagline">URL Shortening Simplified</div>
        </div>
        
        <div class="email-content">
            <h1 class="email-title">Your Secure Login Link</h1>
            
            <p class="message">Hello,</p>
            
            <p class="message">You requested a secure login link for your <strong style="color: #ffffff;">${appName}</strong> account. Click the button below to sign in securely:</p>
            
            <div class="button-container">
                <a href="${loginUrl}" class="login-button">Sign In to ${appName}</a>
            </div>
            
            <div class="divider"></div>
            
            <div class="manual-link-section">
                <p class="link-label">Or copy and paste this secure link in your browser:</p>
                <div class="code-block">${loginUrl}</div>
            </div>
            
            <div class="warning-box">
                <div class="warning-title">Security Notice</div>
                <p class="warning-text">This login link will expire in 15 minutes for your protection. If you didn't request this login, please disregard this email and ensure your account security.</p>
            </div>
        </div>
        
        <div class="email-footer">
            <p class="footer-text">This secure login link was sent to <span class="email-address">${email}</span>.</p>
            <p class="footer-text">If you have any questions or need assistance, please contact our support team.</p>
            <p class="footer-text">&copy; ${currentYear} ${appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  async sendLoginEmail(email, loginToken) {
    const subject = `Your Login Link - ${process.env.APP_NAME || 'NanoCut'}`;
    const html = this.generateLoginEmailTemplate(email, loginToken);
    const text = `Please use the following link to login:\n${process.env.FRONTEND_URL}/auth/verify?token=${loginToken}\n\nThis link will expire in 15 minutes.`;

    return await this.send({
      to: email,
      subject,
      text,
      html,
    });
  }
}

module.exports = new EmailService();
