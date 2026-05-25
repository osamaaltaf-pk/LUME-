import nodemailer from 'nodemailer';

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper: Common HTML Layout
const getEmailLayout = (content, title = 'Notification') => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #1a1a1a; padding: 40px 20px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 2px; text-decoration: none; }
        .body { padding: 40px 30px; line-height: 1.6; }
        .footer { background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #888888; }
        .btn { display: inline-block; background-color: #d4af37; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
        h1 { color: #1a1a1a; margin-top: 0; }
        .highlight { color: #d4af37; font-weight: bold; }
        .otp-box { background-color: #fdfbf7; border: 1px solid #eaddcf; padding: 15px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0; font-family: monospace; border-radius: 4px; }
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; text-transform: uppercase; background-color: #eaddcf; color: #5c4033; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">LUME ATELIER</div>
        </div>
        <div class="body">
          ${content}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Lume Atelier. All rights reserved.<br>
          Crafting illuminated moments through bespoke artistry.
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send OTP Email
export const sendOtpEmail = async (to, otp) => {
  const content = `
    <h1>Verify Your Identity</h1>
    <p>Welcome to Lume. To complete your verification, please use the following One-Time Password (OTP).</p>
    <div class="otp-box">${otp}</div>
    <p>This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials missing in environment variables');
      throw new Error('Email configuration missing');
    }

    await transporter.sendMail({
      from: `"Lume Atelier" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Lume - Verify Your Account',
      html: getEmailLayout(content, 'Verify Account')
    });
    console.log('OTP Email sent to:', to);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error; // Re-throw to be handled by controller
  }
};

// Send Order Update Email
export const sendOrderUpdateEmail = async (to, orderNumber, status, userName) => {

  let messageBody = '';
  switch (status) {
    case 'processed':
      messageBody = 'Your order has been processed and is being prepared for dispatch.';
      break;
    case 'shipped':
      messageBody = 'Good news! Your order is on its way to you.';
      break;
    case 'delivered':
      messageBody = 'Your order has been delivered. We hope you enjoy your Lume piece.';
      break;
    case 'cancelled':
      messageBody = 'Your order has been cancelled.';
      break;
    default:
      messageBody = `The status of your order has been updated to <strong>${status}</strong>.`;
  }

  const content = `
    <h1>Order Update</h1>
    <p>Dear ${userName || 'Customer'},</p>
    <p>${messageBody}</p>
    <p>Order Number: <span class="highlight">#${orderNumber}</span></p>
    <div style="text-align: center; margin: 30px 0;">
      <span class="status-badge">${status}</span>
    </div>
    <p>You can view full details in your account.</p>
    <center><a href="${process.env.FRONTEND_URL || '#'}/profile" class="btn">View Order</a></center>
  `;

  await transporter.sendMail({
    from: `"Lume Atelier" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Lume - Order Update #${orderNumber}`,
    html: getEmailLayout(content, 'Order Update')
  });
};

export default transporter;
