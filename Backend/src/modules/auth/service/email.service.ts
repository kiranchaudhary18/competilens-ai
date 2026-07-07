import nodemailer from "nodemailer";

export class EmailService {
  private static getTransporter() {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER || "kiran.chaudhary.cg@gmail.com";
    const pass = process.env.SMTP_PASS || "";

    // Create reuse transport
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for others
      auth: {
        user,
        pass,
      },
    });
  }

  public static async sendVerificationEmail(email: string, fullName: string, token: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    console.log(`\n======================================================`);
    console.log(`✉️  [LOCAL DEV fallback] Verification Link for ${fullName} (${email}):`);
    console.log(`👉  ${verificationUrl}`);
    console.log(`======================================================\n`);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your CompetiLens Account</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #F8FAFC;
            color: #0F172A;
          }
          .container {
            max-width: 580px;
            margin: 40px auto;
            background: #FFFFFF;
            border-radius: 24px;
            border: 1px solid #E2E8F0;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
          }
          .logo {
            font-size: 20px;
            font-weight: 800;
            color: #2563EB;
            margin-bottom: 24px;
            display: inline-block;
          }
          h1 {
            font-size: 22px;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 12px;
            letter-tight: -0.02em;
          }
          p {
            font-size: 14px;
            font-weight: 500;
            color: #64748B;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .btn-container {
            margin-bottom: 32px;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);
            color: #FFFFFF;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.15);
          }
          .divider {
            height: 1px;
            background-color: #E2E8F0;
            margin: 32px 0 24px 0;
          }
          .footer {
            font-size: 11px;
            font-weight: 600;
            color: #64748B;
            line-height: 1.5;
          }
          .footer a {
            color: #2563EB;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">CompetiLens<span style="color: #06B6D4;">.ai</span></div>
          <h1>Verify your CompetiLens account</h1>
          <p>Hi ${fullName},</p>
          <p>Welcome to CompetiLens AI. Before accessing your competitive intelligence command center, please click the button below to verify your email address.</p>
          <div class="btn-container">
            <a href="${verificationUrl}" class="btn" target="_blank">Verify Email</a>
          </div>
          <p style="font-size: 12px; margin-bottom: 0;">Or copy and paste this link in your browser:</p>
          <p style="font-size: 11px; word-break: break-all;"><a href="${verificationUrl}" style="color: #64748B;">${verificationUrl}</a></p>
          <div class="divider"></div>
          <div class="footer">
            Need help? Contact our <a href="mailto:support@competilens.ai">Support Team</a>.<br>
            &copy; 2026 CompetiLens AI. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    // Only attempt to send if SMTP_PASS is configured, otherwise bypass silently in local dev
    if (!process.env.SMTP_PASS) {
      console.log("⚠️  [EmailService] SMTP_PASS not set. Email delivery bypassed.");
      return;
    }

    try {
      const transporter = this.getTransporter();
      const from = process.env.SMTP_FROM || "kiran.chaudhary.cg@gmail.com";
      await transporter.sendMail({
        from: `"CompetiLens AI" <${from}>`,
        to: email,
        subject: "Verify your CompetiLens account",
        html: htmlContent,
      });
      console.log(`✉️  Verification email sent successfully to ${email}`);
    } catch (err) {
      console.error(`❌ Failed to send verification email to ${email}:`, err);
    }
  }
}
