import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Twilio configuration for WhatsApp
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export interface NotificationData {
  to: string;
  subject?: string;
  message: string;
  alertDetails?: {
    region: string;
    severity: string;
    lossPercentage: number;
    location: { lat: number; lng: number };
  };
}

export async function sendEmailNotification(data: NotificationData): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER) {
      console.log('📧 Email notification (demo mode):', data);
      return true;
    }

    const htmlContent = data.alertDetails
      ? `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">⚡ Electricity Theft Alert</h2>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Region:</strong> ${data.alertDetails.region}</p>
            <p><strong>Severity:</strong> <span style="color: ${
              data.alertDetails.severity === 'HIGH' ? '#dc2626' :
              data.alertDetails.severity === 'MEDIUM' ? '#f59e0b' : '#3b82f6'
            };">${data.alertDetails.severity}</span></p>
            <p><strong>Loss Percentage:</strong> ${data.alertDetails.lossPercentage}%</p>
            <p><strong>Location:</strong> ${data.alertDetails.location.lat}, ${data.alertDetails.location.lng}</p>
          </div>
          <p>${data.message}</p>
          <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
            Please investigate this alert at your earliest convenience.
          </p>
        </div>
      `
      : `<p>${data.message}</p>`;

    await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || '"PSPCL Theft Detection" <noreply@pspcl.gov.in>',
      to: data.to,
      subject: data.subject || '⚡ Electricity Theft Alert',
      html: htmlContent,
    });

    console.log('✅ Email sent to:', data.to);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
}

export async function sendWhatsAppNotification(data: NotificationData): Promise<boolean> {
  try {
    if (!twilioClient || !process.env.TWILIO_WHATSAPP_FROM) {
      console.log('📱 WhatsApp notification (demo mode):', data);
      return true;
    }

    let message = data.message;
    if (data.alertDetails) {
      message = `
⚡ *ELECTRICITY THEFT ALERT*

🏘️ Region: ${data.alertDetails.region}
⚠️ Severity: ${data.alertDetails.severity}
📊 Loss: ${data.alertDetails.lossPercentage}%
📍 Location: ${data.alertDetails.location.lat}, ${data.alertDetails.location.lng}

${data.message}

Please investigate immediately.
      `.trim();
    }

    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${data.to}`,
      body: message,
    });

    console.log('✅ WhatsApp sent to:', data.to);
    return true;
  } catch (error) {
    console.error('❌ WhatsApp error:', error);
    return false;
  }
}

export async function sendSMSNotification(data: NotificationData): Promise<boolean> {
  try {
    if (!twilioClient || !process.env.TWILIO_PHONE_FROM) {
      console.log('📲 SMS notification (demo mode):', data);
      return true;
    }

    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_FROM,
      to: data.to,
      body: data.message,
    });

    console.log('✅ SMS sent to:', data.to);
    return true;
  } catch (error) {
    console.error('❌ SMS error:', error);
    return false;
  }
}
