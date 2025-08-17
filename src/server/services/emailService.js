const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.oauth2Client = null;
    this.setupEmailTransporter();
  }

  async setupEmailTransporter() {
    try {
      if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        // OAuth2 setup for Gmail API
        this.oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
        );

        // Set refresh token if available
        if (process.env.GOOGLE_REFRESH_TOKEN) {
          this.oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
          });
        }

        // Create transporter with OAuth2
        this.transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: process.env.SMTP_USER || 'thando.somacele@gmail.com',
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: await this.getAccessToken()
          }
        });
      } else {
        // Fallback to app password method
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER || 'thando.somacele@gmail.com',
            pass: process.env.SMTP_PASS // App password
          }
        });
      }

      // Verify connection
      await this.transporter.verify();
      logger.info('✅ Email service configured successfully');
    } catch (error) {
      logger.error('❌ Email service configuration failed:', error);
    }
  }

  async getAccessToken() {
    try {
      const { token } = await this.oauth2Client.getAccessToken();
      return token;
    } catch (error) {
      logger.error('Failed to get OAuth2 access token:', error);
      throw error;
    }
  }

  /**
   * Send consultation confirmation email
   */
  async sendConsultationConfirmation(leadData, tenantData, consultationDetails = {}) {
    try {
      const { firstName, lastName, email, legalIssue } = leadData;
      const firmName = tenantData.branding?.companyName || tenantData.name;
      const fromEmail = tenantData.email || process.env.FROM_EMAIL || 'thando.somacele@gmail.com';
      
      const mailOptions = {
        from: {
          name: firmName,
          address: fromEmail
        },
        to: email,
        subject: `Consultation Confirmed - ${firmName}`,
        html: this.generateConsultationEmailTemplate(
          { firstName, lastName, legalIssue },
          tenantData,
          consultationDetails
        ),
        text: this.generateConsultationEmailText(
          { firstName, lastName, legalIssue },
          tenantData,
          consultationDetails
        )
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Consultation email sent to ${email} - Message ID: ${result.messageId}`);
      
      // Log email in database
      await this.logEmail({
        tenantId: tenantData.id,
        recipientEmail: email,
        subject: mailOptions.subject,
        type: 'consultation_confirmation',
        status: 'sent',
        messageId: result.messageId
      });

      return result;
    } catch (error) {
      logger.error('Failed to send consultation email:', error);
      throw error;
    }
  }

  /**
   * Send notification to attorney about new lead
   */
  async sendAttorneyNotification(leadData, tenantData, assignedAttorney) {
    try {
      const { firstName, lastName, email, phone, legalIssue } = leadData;
      const firmName = tenantData.branding?.companyName || tenantData.name;
      
      const mailOptions = {
        from: {
          name: `${firmName} - Lead Notification`,
          address: process.env.FROM_EMAIL || 'thando.somacele@gmail.com'
        },
        to: assignedAttorney.email,
        subject: `New Lead: ${firstName} ${lastName} - ${firmName}`,
        html: this.generateAttorneyNotificationTemplate(leadData, tenantData),
        text: this.generateAttorneyNotificationText(leadData, tenantData)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Attorney notification sent to ${assignedAttorney.email} - Message ID: ${result.messageId}`);
      
      return result;
    } catch (error) {
      logger.error('Failed to send attorney notification:', error);
      throw error;
    }
  }

  /**
   * Send welcome email to new tenant
   */
  async sendWelcomeEmail(tenantData, adminUser) {
    try {
      const mailOptions = {
        from: {
          name: 'Verdict 360',
          address: process.env.FROM_EMAIL || 'thando.somacele@gmail.com'
        },
        to: adminUser.email,
        subject: `Welcome to Verdict 360 - ${tenantData.name}`,
        html: this.generateWelcomeEmailTemplate(tenantData, adminUser),
        text: this.generateWelcomeEmailText(tenantData, adminUser)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Welcome email sent to ${adminUser.email} - Message ID: ${result.messageId}`);
      
      return result;
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  /**
   * Generate consultation confirmation email template
   */
  generateConsultationEmailTemplate(client, tenant, consultation) {
    const firmName = tenant.branding?.companyName || tenant.name;
    const primaryColor = tenant.branding?.primaryColor || '#2563eb';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Consultation Confirmed</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${primaryColor}; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .btn { background: ${primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${firmName}</h1>
                <p>Consultation Confirmed</p>
            </div>
            
            <div class="content">
                <h2>Dear ${client.firstName} ${client.lastName},</h2>
                
                <p>Thank you for reaching out to ${firmName}. We have received your consultation request and one of our experienced attorneys will contact you within 24 hours.</p>
                
                <h3>Your Legal Matter:</h3>
                <p style="background: white; padding: 15px; border-left: 4px solid ${primaryColor};">
                    ${client.legalIssue || 'General legal consultation'}
                </p>
                
                <h3>What happens next?</h3>
                <ul>
                    <li>One of our attorneys will review your case</li>
                    <li>We'll contact you to schedule a convenient time for your consultation</li>
                    <li>Your first consultation is completely free</li>
                    <li>We'll discuss your legal options and next steps</li>
                </ul>
                
                <h3>Important Information:</h3>
                <p>Please note that this email confirmation does not create an attorney-client relationship. This will only be established once we have agreed to represent you in writing.</p>
                
                <p>If you have any urgent questions or need to modify this appointment, please contact us directly:</p>
                <ul>
                    <li>Email: ${tenant.email}</li>
                    <li>Phone: ${tenant.phone || 'Contact via email'}</li>
                </ul>
                
                <p>We look forward to assisting you with your legal matter.</p>
                
                <p>Best regards,<br>
                The ${firmName} Team</p>
            </div>
            
            <div class="footer">
                <p>${tenant.address || ''}</p>
                <p>This email was sent by ${firmName} - Powered by Verdict 360</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateConsultationEmailText(client, tenant, consultation) {
    const firmName = tenant.branding?.companyName || tenant.name;
    
    return `
Dear ${client.firstName} ${client.lastName},

Thank you for reaching out to ${firmName}. We have received your consultation request and one of our experienced attorneys will contact you within 24 hours.

Your Legal Matter:
${client.legalIssue || 'General legal consultation'}

What happens next?
- One of our attorneys will review your case
- We'll contact you to schedule a convenient time for your consultation
- Your first consultation is completely free
- We'll discuss your legal options and next steps

Important Information:
Please note that this email confirmation does not create an attorney-client relationship. This will only be established once we have agreed to represent you in writing.

Contact Information:
Email: ${tenant.email}
Phone: ${tenant.phone || 'Contact via email'}

We look forward to assisting you with your legal matter.

Best regards,
The ${firmName} Team

${tenant.address || ''}
This email was sent by ${firmName} - Powered by Verdict 360
    `;
  }

  generateAttorneyNotificationTemplate(lead, tenant) {
    const firmName = tenant.branding?.companyName || tenant.name;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Lead Notification</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 20px; }
            .lead-info { background: #f3f4f6; padding: 15px; margin: 15px 0; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🚨 New Lead Alert - ${firmName}</h2>
            </div>
            
            <p>A new potential client has submitted a consultation request through your website chatbot.</p>
            
            <div class="lead-info">
                <h3>Client Information:</h3>
                <p><strong>Name:</strong> ${lead.firstName} ${lead.lastName}</p>
                <p><strong>Email:</strong> ${lead.email}</p>
                <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
                <p><strong>Source:</strong> Website Chatbot</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="lead-info">
                <h3>Legal Matter:</h3>
                <p>${lead.legalIssue}</p>
            </div>
            
            <p><strong>Action Required:</strong> Please contact this client within 24 hours to schedule their free consultation.</p>
            
            <p>You can manage this lead and view the full conversation history in your Verdict 360 dashboard.</p>
        </div>
    </body>
    </html>
    `;
  }

  generateAttorneyNotificationText(lead, tenant) {
    return `
NEW LEAD ALERT - ${tenant.branding?.companyName || tenant.name}

A new potential client has submitted a consultation request.

Client Information:
Name: ${lead.firstName} ${lead.lastName}
Email: ${lead.email}
Phone: ${lead.phone || 'Not provided'}
Source: Website Chatbot
Submitted: ${new Date().toLocaleString()}

Legal Matter:
${lead.legalIssue}

Action Required: Please contact this client within 24 hours to schedule their free consultation.
    `;
  }

  generateWelcomeEmailTemplate(tenant, admin) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to Verdict 360</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Verdict 360!</h1>
            </div>
            
            <p>Dear ${admin.firstName} ${admin.lastName},</p>
            
            <p>Welcome to Verdict 360! Your AI-powered legal chatbot for ${tenant.name} is now active and ready to help convert website visitors into consultation bookings.</p>
            
            <h3>Your chatbot is ready to:</h3>
            <ul>
                <li>Answer basic South African legal questions</li>
                <li>Qualify potential clients</li>
                <li>Schedule consultation appointments</li>
                <li>Capture lead information automatically</li>
            </ul>
            
            <h3>Next Steps:</h3>
            <ol>
                <li>Add the chatbot widget to your website</li>
                <li>Customize your firm's branding and welcome message</li>
                <li>Connect your calendar for appointment scheduling</li>
                <li>Review analytics and lead management tools</li>
            </ol>
            
            <p>If you have any questions or need assistance, our support team is here to help.</p>
            
            <p>Best regards,<br>The Verdict 360 Team</p>
        </div>
    </body>
    </html>
    `;
  }

  generateWelcomeEmailText(tenant, admin) {
    return `
Welcome to Verdict 360!

Dear ${admin.firstName} ${admin.lastName},

Welcome to Verdict 360! Your AI-powered legal chatbot for ${tenant.name} is now active and ready to help convert website visitors into consultation bookings.

Your chatbot is ready to:
- Answer basic South African legal questions
- Qualify potential clients
- Schedule consultation appointments
- Capture lead information automatically

Next Steps:
1. Add the chatbot widget to your website
2. Customize your firm's branding and welcome message
3. Connect your calendar for appointment scheduling
4. Review analytics and lead management tools

If you have any questions or need assistance, our support team is here to help.

Best regards,
The Verdict 360 Team
    `;
  }

  /**
   * Log email in database for tracking
   */
  async logEmail(emailData) {
    try {
      const db = getDatabase();
      await db('email_logs').insert({
        tenant_id: emailData.tenantId,
        recipient_email: emailData.recipientEmail,
        subject: emailData.subject,
        type: emailData.type,
        status: emailData.status,
        message_id: emailData.messageId,
        sent_at: db.fn.now()
      });
    } catch (error) {
      logger.error('Failed to log email:', error);
    }
  }

  /**
   * Test email configuration
   */
  async testEmailConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service is working correctly' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new EmailService();