const nodemailer = require('nodemailer');

let cachedTransporter = null;

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'youremail@gmail.com') {
    // Production: use real SMTP credentials from .env
    cachedTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Development fallback: auto-create free Ethereal test account
    console.log('\n📧 No email credentials found — using Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`   Ethereal user: ${testAccount.user}`);
  }

  return cachedTransporter;
}

exports.sendVerificationEmail = async (to, token) => {
  const verifyUrl = `http://localhost:5173/verify/${token}`;

  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Invoice SaaS" <noreply@invoicesaas.com>',
      to,
      subject: 'Verify your email address — Invoice SaaS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; text-align: center;">Welcome to Invoice SaaS!</h2>
          <p style="color: #333; font-size: 16px;">Please click the button below to verify your email address and complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Verify Email</a>
          </div>
          <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link:</p>
          <p style="color: #4f46e5; font-size: 14px; word-break: break-all;">${verifyUrl}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    // For Ethereal test accounts, print the preview URL to the terminal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('\n✅ Verification email sent!');
      console.log('👉 Preview URL (open in browser):', previewUrl);
      console.log('   Or use this direct verify link:', verifyUrl, '\n');
    } else {
      console.log(`✅ Verification email sent to ${to}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
};

