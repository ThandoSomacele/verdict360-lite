const { google } = require('googleapis');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

class CalendarService {
  constructor() {
    this.oauth2Client = null;
    this.calendar = null;
    this.setupGoogleCalendar();
  }

  setupGoogleCalendar() {
    try {
      if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        this.oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.CALENDAR_REDIRECT_URI || 'http://localhost:3000/auth/google/calendar/callback'
        );

        // Set refresh token if available
        if (process.env.GOOGLE_REFRESH_TOKEN) {
          this.oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
          });
        }

        this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
        logger.info('✅ Google Calendar service initialized');
      } else {
        logger.warn('⚠️ Google Calendar credentials not found');
      }
    } catch (error) {
      logger.error('❌ Failed to setup Google Calendar:', error);
    }
  }

  /**
   * Generate OAuth2 authorization URL for calendar access
   */
  generateAuthUrl(tenantId) {
    if (!this.oauth2Client) {
      throw new Error('Google OAuth2 client not configured');
    }

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: tenantId, // Pass tenant ID to track which tenant is connecting
      prompt: 'consent' // Force consent to get refresh token
    });

    return authUrl;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code, tenantId) {
    try {
      if (!this.oauth2Client) {
        throw new Error('Google OAuth2 client not configured');
      }

      const { tokens } = await this.oauth2Client.getToken(code);
      
      // Store tokens in database for this tenant
      const db = getDatabase();
      await db('tenant_integrations').insert({
        tenant_id: tenantId,
        integration_type: 'google_calendar',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        is_active: true,
        metadata: JSON.stringify({
          scope: tokens.scope,
          token_type: tokens.token_type
        })
      }).onConflict(['tenant_id', 'integration_type']).merge();

      logger.info(`Calendar integration activated for tenant: ${tenantId}`);
      return tokens;
    } catch (error) {
      logger.error('Failed to exchange calendar authorization code:', error);
      throw error;
    }
  }

  /**
   * Get available time slots for consultation booking
   */
  async getAvailableSlots(tenantId, date, duration = 60) {
    try {
      const tokens = await this.getTenantTokens(tenantId);
      if (!tokens) {
        throw new Error('Calendar not connected for this tenant');
      }

      this.oauth2Client.setCredentials(tokens);

      const startOfDay = new Date(date);
      startOfDay.setHours(9, 0, 0, 0); // 9 AM

      const endOfDay = new Date(date);
      endOfDay.setHours(17, 0, 0, 0); // 5 PM

      // Get busy times from calendar
      const busyResponse = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          items: [{ id: 'primary' }]
        }
      });

      const busyTimes = busyResponse.data.calendars.primary.busy || [];

      // Generate available slots
      const availableSlots = this.generateTimeSlots(startOfDay, endOfDay, duration, busyTimes);

      return availableSlots;
    } catch (error) {
      logger.error('Failed to get available slots:', error);
      throw error;
    }
  }

  /**
   * Create consultation appointment
   */
  async createConsultationAppointment(tenantId, appointmentData) {
    try {
      const { 
        clientName, 
        clientEmail, 
        clientPhone, 
        legalIssue, 
        startTime, 
        duration = 60,
        attorneyEmail,
        notes = ''
      } = appointmentData;

      const tokens = await this.getTenantTokens(tenantId);
      if (!tokens) {
        throw new Error('Calendar not connected for this tenant');
      }

      this.oauth2Client.setCredentials(tokens);

      const startDateTime = new Date(startTime);
      const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 1000));

      // Get tenant details for meeting info
      const db = getDatabase();
      const tenant = await db('tenants').where({ id: tenantId }).first();
      const firmName = tenant.branding?.companyName || tenant.name;

      const event = {
        summary: `Legal Consultation - ${clientName}`,
        description: this.generateAppointmentDescription({
          clientName,
          clientEmail,
          clientPhone,
          legalIssue,
          firmName,
          notes
        }),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Africa/Johannesburg'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Africa/Johannesburg'
        },
        attendees: [
          { email: clientEmail, displayName: clientName },
          ...(attorneyEmail ? [{ email: attorneyEmail }] : [])
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours
            { method: 'email', minutes: 60 },      // 1 hour
            { method: 'popup', minutes: 15 }       // 15 minutes
          ]
        },
        conferenceData: {
          createRequest: {
            requestId: `verdict360-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
      });

      // Store appointment in database
      await db('appointments').insert({
        id: response.data.id,
        tenant_id: tenantId,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        legal_issue: legalIssue,
        start_time: startDateTime,
        end_time: endDateTime,
        status: 'scheduled',
        calendar_event_id: response.data.id,
        meeting_link: response.data.hangoutLink,
        notes: notes
      });

      logger.info(`Consultation appointment created: ${response.data.id} for tenant ${tenantId}`);

      return {
        appointmentId: response.data.id,
        meetingLink: response.data.hangoutLink,
        startTime: startDateTime,
        endTime: endDateTime,
        calendarUrl: response.data.htmlLink
      };
    } catch (error) {
      logger.error('Failed to create consultation appointment:', error);
      throw error;
    }
  }

  /**
   * Update appointment status
   */
  async updateAppointment(tenantId, appointmentId, updates) {
    try {
      const tokens = await this.getTenantTokens(tenantId);
      if (!tokens) {
        throw new Error('Calendar not connected for this tenant');
      }

      this.oauth2Client.setCredentials(tokens);

      const db = getDatabase();
      
      // Update in database
      await db('appointments')
        .where({ 
          calendar_event_id: appointmentId,
          tenant_id: tenantId 
        })
        .update({
          ...updates,
          updated_at: db.fn.now()
        });

      // Update in Google Calendar if needed
      if (updates.status === 'cancelled') {
        await this.calendar.events.delete({
          calendarId: 'primary',
          eventId: appointmentId,
          sendUpdates: 'all'
        });
      }

      logger.info(`Appointment updated: ${appointmentId} for tenant ${tenantId}`);
      return true;
    } catch (error) {
      logger.error('Failed to update appointment:', error);
      throw error;
    }
  }

  /**
   * Get tenant's calendar tokens
   */
  async getTenantTokens(tenantId) {
    try {
      const db = getDatabase();
      const integration = await db('tenant_integrations')
        .where({
          tenant_id: tenantId,
          integration_type: 'google_calendar',
          is_active: true
        })
        .first();

      if (!integration) {
        return null;
      }

      // Check if token needs refresh
      const now = new Date();
      const tokenExpiry = new Date(integration.token_expiry);

      if (tokenExpiry <= now) {
        // Token expired, refresh it
        this.oauth2Client.setCredentials({
          refresh_token: integration.refresh_token
        });

        const { credentials } = await this.oauth2Client.refreshAccessToken();
        
        // Update stored tokens
        await db('tenant_integrations')
          .where({ id: integration.id })
          .update({
            access_token: credentials.access_token,
            token_expiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
            updated_at: db.fn.now()
          });

        return credentials;
      }

      return {
        access_token: integration.access_token,
        refresh_token: integration.refresh_token
      };
    } catch (error) {
      logger.error('Failed to get tenant tokens:', error);
      return null;
    }
  }

  /**
   * Generate available time slots
   */
  generateTimeSlots(startTime, endTime, duration, busyTimes) {
    const slots = [];
    const slotDuration = duration * 60 * 1000; // Convert to milliseconds
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration);
      
      // Check if this slot conflicts with busy times
      const isAvailable = !busyTimes.some(busy => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        
        return (currentTime < busyEnd && slotEnd > busyStart);
      });
      
      if (isAvailable && slotEnd <= endTime) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEnd),
          available: true
        });
      }
      
      // Move to next 30-minute slot
      currentTime = new Date(currentTime.getTime() + (30 * 60 * 1000));
    }
    
    return slots;
  }

  /**
   * Generate appointment description for calendar event
   */
  generateAppointmentDescription(data) {
    const { clientName, clientEmail, clientPhone, legalIssue, firmName, notes } = data;
    
    return `
📋 Legal Consultation Appointment

👤 Client: ${clientName}
📧 Email: ${clientEmail}
📞 Phone: ${clientPhone || 'Not provided'}

⚖️ Legal Matter:
${legalIssue}

🏢 Law Firm: ${firmName}

📝 Additional Notes:
${notes || 'No additional notes'}

---
This appointment was scheduled through Verdict 360 AI Legal Chatbot.
Please ensure all necessary documents are prepared before the consultation.
    `.trim();
  }

  /**
   * Get tenant's upcoming appointments
   */
  async getUpcomingAppointments(tenantId, limit = 10) {
    try {
      const db = getDatabase();
      const appointments = await db('appointments')
        .where('tenant_id', tenantId)
        .where('start_time', '>=', new Date())
        .where('status', '!=', 'cancelled')
        .orderBy('start_time', 'asc')
        .limit(limit);

      return appointments;
    } catch (error) {
      logger.error('Failed to get upcoming appointments:', error);
      throw error;
    }
  }

  /**
   * Check if calendar is connected for tenant
   */
  async isCalendarConnected(tenantId) {
    try {
      const tokens = await this.getTenantTokens(tenantId);
      return !!tokens;
    } catch (error) {
      return false;
    }
  }

  /**
   * Disconnect calendar integration
   */
  async disconnectCalendar(tenantId) {
    try {
      const db = getDatabase();
      await db('tenant_integrations')
        .where({
          tenant_id: tenantId,
          integration_type: 'google_calendar'
        })
        .update({
          is_active: false,
          updated_at: db.fn.now()
        });

      logger.info(`Calendar disconnected for tenant: ${tenantId}`);
      return true;
    } catch (error) {
      logger.error('Failed to disconnect calendar:', error);
      throw error;
    }
  }
}

module.exports = new CalendarService();