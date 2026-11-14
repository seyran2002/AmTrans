const fs = require('fs');
const path = require('path');

const beDir = 'c:\\Users\\user\\Desktop\\amtrans-be';

// 1. Write src/email/email.templates.ts
const emailTemplatesContent = `export enum SupportedLanguage {
  EN = 'en',
  RU = 'ru',
  HY = 'hy',
}

export interface EmailTemplateContent {
  subject: string;
  html: string;
}

export function getRegistrationEmailTemplate(
  language: SupportedLanguage | 'en' | 'ru' | 'hy',
  verifyUrl: string,
): EmailTemplateContent {
  const templates: Record<string, EmailTemplateContent> = {
    en: {
      subject: 'Confirm your registration - AMTRANS',
      html: \`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
            .container { max-width: 600px; background: #ffffff; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { text-align: center; border-bottom: 1px solid #eef2f5; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #1e293b; margin: 0; font-size: 24px; }
            .content { color: #475569; font-size: 16px; line-height: 1.6; }
            .btn-wrapper { text-align: center; margin: 30px 0; }
            .btn { background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
            .footer { font-size: 13px; color: #94a3b8; border-top: 1px solid #eef2f5; padding-top: 20px; margin-top: 30px; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to AMTRANS</h1>
            </div>
            <div class="content">
              <p>Thank you for creating an account with AMTRANS.</p>
              <p>To complete your registration and verify your email address, please click the button below:</p>
              <div class="btn-wrapper">
                <a href="\${verifyUrl}" class="btn" target="_blank">Confirm Registration</a>
              </div>
              <p>If you did not initiate this request, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>If the button above does not work, copy and paste this URL into your browser:</p>
              <p><a href="\${verifyUrl}">\${verifyUrl}</a></p>
            </div>
          </div>
        </body>
        </html>
      \`,
    },
    ru: {
      subject: 'Подтвердите регистрацию - AMTRANS',
      html: \`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
            .container { max-width: 600px; background: #ffffff; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { text-align: center; border-bottom: 1px solid #eef2f5; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #1e293b; margin: 0; font-size: 24px; }
            .content { color: #475569; font-size: 16px; line-height: 1.6; }
            .btn-wrapper { text-align: center; margin: 30px 0; }
            .btn { background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
            .footer { font-size: 13px; color: #94a3b8; border-top: 1px solid #eef2f5; padding-top: 20px; margin-top: 30px; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Добро пожаловать в AMTRANS</h1>
            </div>
            <div class="content">
              <p>Спасибо за создание учетной записи в AMTRANS.</p>
              <p>Чтобы завершить регистрацию и подтвердить свой адрес электронной почты, нажмите кнопку ниже:</p>
              <div class="btn-wrapper">
                <a href="\${verifyUrl}" class="btn" target="_blank">Подтвердить регистрацию</a>
              </div>
              <p>Если вы не отправляли этот запрос, просто проигнорируйте это письмо.</p>
            </div>
            <div class="footer">
              <p>Если кнопка выше не работает, скопируйте и вставьте эту ссылку в ваш браузер:</p>
              <p><a href="\${verifyUrl}">\${verifyUrl}</a></p>
            </div>
          </div>
        </body>
        </html>
      \`,
    },
    hy: {
      subject: 'Հաստատեք գրանցումը - AMTRANS',
      html: \`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
            .container { max-width: 600px; background: #ffffff; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { text-align: center; border-bottom: 1px solid #eef2f5; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #1e293b; margin: 0; font-size: 24px; }
            .content { color: #475569; font-size: 16px; line-height: 1.6; }
            .btn-wrapper { text-align: center; margin: 30px 0; }
            .btn { background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
            .footer { font-size: 13px; color: #94a3b8; border-top: 1px solid #eef2f5; padding-top: 20px; margin-top: 30px; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Բարի գալուստ AMTRANS</h1>
            </div>
            <div class="content">
              <p>Շնորհակալություն AMTRANS-ում հաշիվ ստեղծելու համար:</p>
              <p>Գրանցումն ավարտելու և Ձեր էլ. հասցեն հաստատելու համար խնդրում ենք սեղմել ներքևի կոճակը.</p>
              <div class="btn-wrapper">
                <a href="\${verifyUrl}" class="btn" target="_blank">Հաստատել գրանցումը</a>
              </div>
              <p>Եթե Դուք չեք կատարել այս հարցումը, խնդրում ենք անտեսել այս նամակը:</p>
            </div>
            <div class="footer">
              <p>Եթե վերևի կոճակը չի աշխատում, պատճենեք և տեղադրեք այս հղումը Ձեր բրաուզերում.</p>
              <p><a href="\${verifyUrl}">\${verifyUrl}</a></p>
            </div>
          </div>
        </body>
        </html>
      \`,
    },
  };

  return templates[language] || templates.hy;
}

export interface OrderReviewEmailTemplateContent {
  subject: string;
  html: string;
  text: string;
}

export function getOrderReviewEmailTemplate(
  orderId: string,
  pageLink: string,
  hasQrCode: boolean,
): OrderReviewEmailTemplateContent {
  const subject = 'New Order Requires Review — AmTrans';

  const text = \`Hello,

A new order has been registered in AmTrans and requires your review.

Order ID: \${orderId}

Status: UNDER_REVIEW

Please review the order details and take the necessary action.

View Order in Dashboard:
\${pageLink}

AmTrans Team\`;

  const html = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; background: #ffffff; margin: 0 auto; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 1px solid #eef2f5; padding-bottom: 20px; margin-bottom: 24px; }
    .header h1 { color: #1e293b; margin: 0; font-size: 22px; font-weight: 700; }
    .content { color: #475569; font-size: 15px; line-height: 1.6; }
    .order-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px 20px; margin: 20px 0; }
    .order-info { margin: 6px 0; font-size: 15px; color: #334155; }
    .badge { display: inline-block; background-color: #fef3c7; color: #92400e; font-weight: 600; padding: 2px 8px; border-radius: 4px; font-size: 13px; }
    .qr-container { text-align: center; margin: 24px 0; }
    .qr-image { width: 160px; height: 160px; border-radius: 6px; border: 1px solid #e2e8f0; padding: 8px; background: #ffffff; }
    .btn-wrapper { text-align: center; margin: 28px 0; }
    .btn { background-color: #2563eb; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block; }
    .footer { font-size: 14px; color: #64748b; border-top: 1px solid #eef2f5; padding-top: 20px; margin-top: 28px; }
  </style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;">
  <div class="container" style="max-width: 600px; background: #ffffff; margin: 0 auto; padding: 32px; border-radius: 8px; border: 1px solid #eef2f5; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div class="header" style="text-align: center; border-bottom: 1px solid #eef2f5; padding-bottom: 20px; margin-bottom: 24px;">
      <h1 style="color: #1e293b; margin: 0; font-size: 22px; font-weight: 700;">AmTrans</h1>
    </div>
    <div class="content" style="color: #475569; font-size: 15px; line-height: 1.6;">
      <p style="margin-top: 0;">Hello,</p>
      <p>A new order has been registered in AmTrans and requires your review.</p>
      <div class="order-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px 20px; margin: 20px 0;">
        <p class="order-info" style="margin: 6px 0; font-size: 15px; color: #334155;"><strong>Order ID:</strong> \${orderId}</p>
        <p class="order-info" style="margin: 6px 0; font-size: 15px; color: #334155;"><strong>Status:</strong> <span class="badge" style="display: inline-block; background-color: #fef3c7; color: #92400e; font-weight: 600; padding: 2px 8px; border-radius: 4px; font-size: 13px;">UNDER_REVIEW</span></p>
      </div>
      <p>Please review the order details and take the necessary action.</p>
      \${hasQrCode ? \`
      <div class="qr-container" style="text-align: center; margin: 24px 0;">
        <img src="cid:order-qrcode" alt="Order QR Code" class="qr-image" width="160" height="160" style="display: inline-block; border-radius: 6px; border: 1px solid #e2e8f0; padding: 8px; background: #ffffff;" />
      </div>
      \` : ''}
      <div class="btn-wrapper" style="text-align: center; margin: 28px 0;">
        <a href="\${pageLink}" class="btn" target="_blank" style="background-color: #2563eb; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">View Order in Dashboard</a>
      </div>
    </div>
    <div class="footer" style="font-size: 14px; color: #64748b; border-top: 1px solid #eef2f5; padding-top: 20px; margin-top: 28px;">
      <p style="margin: 0; color: #334155; font-weight: 600;">AmTrans Team</p>
    </div>
  </div>
</body>
</html>\`;

  return { subject, html, text };
}
`;

fs.writeFileSync(path.join(beDir, 'src/email/email.templates.ts'), emailTemplatesContent, 'utf8');
console.log('1. Wrote email.templates.ts');

// 2. Write src/email/email.service.ts
const emailServiceContent = `import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  getRegistrationEmailTemplate,
  getOrderReviewEmailTemplate,
  SupportedLanguage,
} from './email.templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const smtpHost = this.configService.get<string>('EMAIL_HOST') || this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const smtpPort = parseInt(this.configService.get<string>('EMAIL_PORT') || this.configService.get<string>('SMTP_PORT') || '587', 10);
    const smtpUser = this.configService.get<string>('EMAIL_USER') || this.configService.get<string>('SMTP_USER') || this.configService.get<string>('EMAIL');
    const smtpPass = this.configService.get<string>('EMAIL_PASSWORD') || this.configService.get<string>('SMTP_PASS') || this.configService.get<string>('EMAIL_PASS');

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
    });
  }

  async sendRegistrationConfirmation(
    email: string,
    userId: string,
    language: SupportedLanguage,
  ): Promise<void> {
    const senderEmail = this.configService.get<string>('EMAIL_USER') || this.configService.get<string>('EMAIL');
    const rawFrontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const frontendUrl = rawFrontendUrl.replace(/\\/+$/, '');

    const encodedEmail = encodeURIComponent(email);
    const encodedCode = encodeURIComponent(userId);
    const verifyUrl = \`\${frontendUrl}/auth/verify?email=\${encodedEmail}&code=\${encodedCode}\`;

    const template = getRegistrationEmailTemplate(language, verifyUrl);

    try {
      await this.transporter.sendMail({
        from: senderEmail,
        to: email,
        subject: template.subject,
        html: template.html,
      });
      this.logger.log(\`Registration confirmation email sent to \${email} (\${language})\`);
    } catch (error) {
      this.logger.error(\`Failed to send registration confirmation email to \${email}:\`, error);
      throw new InternalServerErrorException('Failed to send verification email. Please try again later.');
    }
  }

  async sendOrderReviewNotification(
    email: string,
    orderId: string,
    qrCodeUrl?: string | null,
  ): Promise<void> {
    const senderEmail = this.configService.get<string>('EMAIL_USER') || this.configService.get<string>('EMAIL');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const cleanFrontendUrl = frontendUrl.replace(/\\/+$/, '');
    const pageLink = \`\${cleanFrontendUrl}/dashboard/manage-orders/\${orderId}\`;

    const template = getOrderReviewEmailTemplate(orderId, pageLink, Boolean(qrCodeUrl));

    const attachments: nodemailer.Attachment[] = [];
    if (qrCodeUrl) {
      attachments.push({
        filename: \`order-\${orderId}-qrcode.png\`,
        path: qrCodeUrl,
        cid: 'order-qrcode',
      });
    }

    try {
      await this.transporter.sendMail({
        from: senderEmail,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        attachments,
      });
      this.logger.log(\`Order review notification email sent to \${email} for order \${orderId}\`);
    } catch (error: any) {
      this.logger.error(
        \`Failed to send order review notification email to \${email} for order \${orderId}: \${error?.message || error}\`,
        error?.stack,
      );
      throw error;
    }
  }
}
`;

fs.writeFileSync(path.join(beDir, 'src/email/email.service.ts'), emailServiceContent, 'utf8');
console.log('2. Wrote email.service.ts');

// 3. Write src/orders/orders.module.ts
const ordersModuleContent = `import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, AuthModule, EmailModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
`;

fs.writeFileSync(path.join(beDir, 'src/orders/orders.module.ts'), ordersModuleContent, 'utf8');
console.log('3. Wrote orders.module.ts');

// 4. Write src/orders/orders.service.ts
const ordersServiceContent = `/// <reference types="multer" />
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { OrderStatus, Role } from '../../generated/prisma';
import { CloudinaryService, CloudinaryUploadResult } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { UserFromJwt } from '../auth/jwt.strategy';
import { CreateOrderDto } from './dto/create-order.dto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'application/pdf',
  'application/msword',
  'text/plain',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) { }

  async create(
    user: UserFromJwt,
    dto: CreateOrderDto,
    invoiceFile?: Express.Multer.File,
  ) {
    // 1. Verify fromOffice and toOffice exist
    const [fromOffice, toOffice] = await Promise.all([
      this.prisma.office.findUnique({ where: { id: dto.fromOfficeId } }),
      this.prisma.office.findUnique({ where: { id: dto.toOfficeId } }),
    ]);

    if (!fromOffice) {
      throw new NotFoundException(
        \`From office with id "\${dto.fromOfficeId}" not found\`,
      );
    }

    if (!toOffice) {
      throw new NotFoundException(
        \`To office with id "\${dto.toOfficeId}" not found\`,
      );
    }

    // 2. Verify receiver exists and enforce authorization
    if (dto.receiverId) {
      const receiver = await this.prisma.receiver.findUnique({
        where: { id: dto.receiverId },
      });
      if (!receiver) {
        throw new NotFoundException(
          \`Receiver with id "\${dto.receiverId}" not found\`,
        );
      }

      if (user.role === Role.CUSTOMER && receiver.userId !== user.id) {
        throw new ForbiddenException(
          'You do not have permission to create an order for this receiver',
        );
      }
    }

    // 3. Upload invoice file if provided
    let invoiceUrl: string | null = null;
    if (invoiceFile) {
      this.validateInvoiceFile(invoiceFile);
      try {
        const uploadResult = await this.uploadWithRetry(
          invoiceFile,
          'orders',
          3,
        );
        invoiceUrl = uploadResult.secureUrl;
      } catch (error: any) {
        this.logger.error(
          \`Failed to upload invoice file for order: \${error?.message || error}\`,
        );
        throw new InternalServerErrorException(
          'Failed to upload invoice file to Cloudinary. Please try again.',
        );
      }
    }

    // 4. Create Order in database (status defaults to UNDER_REVIEW)
    const order = await this.prisma.order.create({
      data: {
        fromOfficeId: dto.fromOfficeId,
        toOfficeId: dto.toOfficeId,
        receiverId: dto.receiverId || null,
        userId: user.id,
        productPrice: dto.productPrice,
        currency: dto.currency,
        marketName: dto.marketName,
        productDescription: dto.productDescription,
        comment: dto.comment,
        weight: dto.weight,
        length: dto.length,
        width: dto.width,
        height: dto.height,
        invoiceUrl,
        status: OrderStatus.UNDER_REVIEW,
      },
      include: {
        fromOffice: true,
        toOffice: true,
        receiver: true,
      },
    });

    // 5. Generate QR code in backend and upload to Cloudinary
    let finalOrder = order;
    const qrCodeUrl = await this.generateAndUploadQrCode(order.id);
    if (qrCodeUrl) {
      finalOrder = await this.prisma.order.update({
        where: { id: order.id },
        data: { qrCode: qrCodeUrl },
        include: {
          fromOffice: true,
          toOffice: true,
          receiver: true,
          user: true,
        },
      });
    }

    // 6. Notify office users of new order requiring review
    await this.notifyOfficeUsersOfNewOrder(finalOrder);

    return finalOrder;
  }

  async findByOfficeId(officeId: string) {
    if (!officeId || !officeId.trim()) {
      throw new BadRequestException('officeId is required');
    }

    return this.prisma.order.findMany({
      where: {
        OR: [
          { fromOfficeId: officeId.trim() },
          { toOfficeId: officeId.trim() },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        fromOffice: {
          include: {
            country: true,
          },
        },
        toOffice: {
          include: {
            country: true,
          },
        },
        receiver: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            code: true,
            companyName: true,
            taxpayerId: true,
            documentNumber: true,
            hyDocumentType: true,
            enDocumentType: true,
            ruDocumentType: true,
            isIndividual: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        fromOffice: {
          include: {
            country: true,
          },
        },
        toOffice: {
          include: {
            country: true,
          },
        },
        receiver: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            code: true,
            companyName: true,
            isIndividual: true,
            role: true,
          },
        },
      },
    });
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        productPrice: true,
        currency: true,
        marketName: true,
        productDescription: true,
        weight: true,
        length: true,
        width: true,
        height: true,
        invoiceUrl: true,
        qrCode: true,
        comment: true,
        createdAt: true,
        fromOffice: {
          select: {
            id: true,
            city: true,
            province: true,
            fullAddress: true,
            country: { select: { id: true, enName: true, hyName: true, ruName: true } },
          },
        },
        toOffice: {
          select: {
            id: true,
            city: true,
            province: true,
            fullAddress: true,
            country: { select: { id: true, enName: true, hyName: true, ruName: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            address: true,
          },
        },
      },
    });
  }

  private async notifyOfficeUsersOfNewOrder(order: {
    id: string;
    status: OrderStatus;
    fromOfficeId: string;
    qrCode?: string | null;
  }): Promise<void> {
    if (order.status !== OrderStatus.UNDER_REVIEW || !order.fromOfficeId) {
      return;
    }

    try {
      const officeUsers = await this.prisma.user.findMany({
        where: { officeId: order.fromOfficeId },
        select: { id: true, email: true },
      });

      if (!officeUsers || officeUsers.length === 0) {
        return;
      }

      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      const validEmails = Array.from(
        new Set(
          officeUsers
            .map((u) => u.email?.trim())
            .filter((email): email is string => Boolean(email && emailRegex.test(email))),
        ),
      );

      if (validEmails.length === 0) {
        return;
      }

      await Promise.allSettled(
        validEmails.map(async (email) => {
          try {
            await this.emailService.sendOrderReviewNotification(
              email,
              order.id,
              order.qrCode,
            );
          } catch (err: any) {
            this.logger.warn(
              \`Order review notification to \${email} for order \${order.id} failed: \${err?.message || err}\`,
            );
          }
        }),
      );
    } catch (error: any) {
      this.logger.error(
        \`Failed to process office notifications for order \${order.id}: \${error?.message || error}\`,
      );
    }
  }

  private validateInvoiceFile(file: Express.Multer.File) {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Invoice file buffer is empty');
    }

    if (file.size && file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        'Invoice file size exceeds the maximum limit of 10MB',
      );
    }

    if (file.buffer.length > MAX_FILE_SIZE) {
      throw new BadRequestException(
        'Invoice file size exceeds the maximum limit of 10MB',
      );
    }

    const isAllowedMime =
      ALLOWED_MIME_TYPES.includes(file.mimetype) ||
      file.mimetype?.startsWith('image/') ||
      file.mimetype === 'application/pdf';

    const isPdfExt =
      file.originalname && file.originalname.toLowerCase().endsWith('.pdf');
    const isImageExt =
      file.originalname &&
      /\\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.originalname);

    if (!isAllowedMime && !isPdfExt && !isImageExt) {
      throw new BadRequestException(
        'Invalid file type. Only images (JPEG, PNG, WEBP, GIF) and PDF files are allowed for invoices.',
      );
    }
  }

  private async generateAndUploadQrCode(orderId: string): Promise<string | null> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      process.env.FRONTEND_URL ||
      'http://localhost:5173';
    const cleanFrontendUrl = frontendUrl.replace(/\\/+$/, '');
    const qrContent = \`\${cleanFrontendUrl}/dashboard/manage-orders/\${orderId}\`;

    try {
      const qrBuffer = await QRCode.toBuffer(qrContent, {
        type: 'png',
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M',
      });

      const uploadResult = await this.uploadWithRetry(
        qrBuffer,
        'orders',
        3,
      );

      return uploadResult.secureUrl;
    } catch (error: any) {
      this.logger.error(
        \`Failed to generate or upload QR code for order \${orderId}: \${error?.message || error}\`,
      );
      return null;
    }
  }

  private async uploadWithRetry(
    file: { buffer: Buffer } | Buffer,
    folder: string,
    maxRetries = 3,
  ): Promise<CloudinaryUploadResult> {
    let lastError: any;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.cloudinaryService.uploadImage(file, folder);
      } catch (error: any) {
        lastError = error;
        this.logger.warn(
          \`Cloudinary upload attempt \${attempt}/\${maxRetries} to "\${folder}" failed: \${error?.message || error}\`,
        );
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        }
      }
    }
    throw lastError;
  }
}
`;

fs.writeFileSync(path.join(beDir, 'src/orders/orders.service.ts'), ordersServiceContent, 'utf8');
console.log('4. Wrote orders.service.ts');
