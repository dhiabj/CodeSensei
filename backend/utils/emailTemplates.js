module.exports = {
  verificationEmail: (verificationUrl) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { max-width: 200px; height: auto; }
            .content { background-color: #f8f9fa; padding: 30px; border-radius: 10px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #2F80ED; 
              color: white !important; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
              font-weight: bold;
            }
            .footer { 
              margin-top: 20px; 
              text-align: center; 
              color: #666; 
              font-size: 0.9em;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://res.cloudinary.com/dezebh6ez/image/upload/v1744369143/logo_wjcr3y.png" alt="CodeSensei Logo" class="logo">
          </div>
          <div class="content">
            <h2>Welcome to CodeSensei! 👨💻</h2>
            <p>Thank you for creating an account. We're excited to help you improve your code quality!</p>
            <p>Please verify your email address to activate your account:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>This verification link will expire in 24 hours. If you didn't create an account with CodeSensei, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The CodeSensei Team</p>
            <p>Need help? Contact us at <a href="mailto:${
              process.env.EMAIL_USER
            }">${process.env.EMAIL_USER}</a></p>
            <p>© ${new Date().getFullYear()} CodeSensei. All rights reserved.</p>
            <div style="margin-top: 10px;">
             <a href="https://github.com/dhiabj/CodeSensei.git" style="color: #2F80ED; text-decoration: none; margin: 0 10px;">GitHub</a>
            </div>
          </div>
        </body>
      </html>
    `,
};
