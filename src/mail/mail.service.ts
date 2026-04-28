// mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendContactEmail(data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    location: string;
    space: string;
    message: string;
    houseNumber: string;
    images?: string[];
    contactId?: number;
  }) {

    try {
      const result = await this.mailerService.sendMail({
        from: `"Rivo Website" <info@rivoaannemerbedrijf.nl>`,
        to: 'info@rivoaannemerbedrijf.nl',
        subject: `📬 رسالة جديدة من ${data.firstName + data.lastName} - موقع البناء`,
        html: `
          <!DOCTYPE html>
          <html dir="rtl">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Tahoma', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0d9488; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .info-box { background: #f0fdf4; padding: 15px; margin: 15px 0; border-right: 4px solid #0d9488; }
              .message-box { background: #fefce8; padding: 15px; margin: 15px 0; border-right: 4px solid #eab308; }
              .footer { text-align: center; padding: 15px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>📬 رسالة جديدة من الموقع</h2>
              </div>
              <div class="content">
                <div class="info-box">
                  <h3 style="color: #0d9488;">👤 معلومات المرسل:</h3>
                  <p><strong>الاسم:</strong> ${data.firstName + data.lastName}</p>
                  <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                </div>
                
                <div class="info-box">
                  <h3 style="color: #0d9488;">📍 العنوان:</h3>
                  <p><strong>الشارع:</strong> ${data.location}</p>
                  <p><strong>رقم المنزل:</strong> ${data.houseNumber}</p>
                </div>
                
                <div class="message-box">
                  <h3 style="color: #eab308;">✉️ محتوى الرسالة:</h3>
                  <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
                </div>
                
                ${data.images && data.images.length > 0
            ? `
                  <div class="info-box">
                    <h3 style="color: #0d9488;">🖼️ الصور المرفقة:</h3>
                    <p>عدد الصور: ${data.images.length}</p>
                    <p>سيتم حفظ الصور في الخادم</p>
                  </div>
                `
            : ''
          }
                
                <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                  <strong>معرّف الرسالة:</strong> ${data.contactId}<br>
                  <strong>الوقت:</strong> ${new Date().toLocaleString('ar-EG')}
                </p>
              </div>
              <div class="footer">
                تم إرسال هذه الرسالة تلقائياً من نموذج الاتصال
              </div>
            </div>
          </body>
          </html>
        `,
        // نسخة نصية للإيميل (للعملاء الذين لا يدعمون HTML)
        text: `
          رسالة جديدة من ${data.firstName + data.lastName}
          
          الاسم: ${data.firstName + data.lastName}
          البريد: ${data.email}
          العنوان: ${data.location} - ${data.houseNumber}
          
          الرسالة:
          ${data.message}
          
          عدد الصور: ${data.images?.length || 0}
          معرّف الرسالة: ${data.contactId}
        `,
      });

      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('🔗 Preview URL:', result.messageId); // لـ Ethereal ستحصل على رابط معاينة

      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw new Error('Failed to send email: ' + error);
    }
  }
}
