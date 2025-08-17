const express = require('express');
const router = express.Router();
const calendarService = require('../services/calendarService');
const { authenticateToken, requireTenantAccess } = require('../middleware/auth');
const { requireActiveSubscription, requireFeature } = require('../middleware/billing');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

/**
 * Get calendar connection status
 */
router.get('/status', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const isConnected = await calendarService.isCalendarConnected(tenantId);
    
    res.json({
      success: true,
      connected: isConnected,
      integration_type: 'google_calendar'
    });
  } catch (error) {
    logger.error('Error checking calendar status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check calendar status'
    });
  }
});

/**
 * Get Google Calendar authorization URL
 */
router.get('/connect', authenticateToken, requireTenantAccess, requireFeature('calendar_integration'), async (req, res) => {
  try {
    const { tenantId } = req.user;
    const authUrl = calendarService.generateAuthUrl(tenantId);
    
    res.json({
      success: true,
      auth_url: authUrl,
      message: 'Visit the auth_url to connect your Google Calendar'
    });
  } catch (error) {
    logger.error('Error generating calendar auth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate calendar authorization URL'
    });
  }
});

/**
 * Handle Google Calendar OAuth callback
 */
router.post('/callback', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { code, state } = req.body;
    const { tenantId } = req.user;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Verify state matches tenant ID for security
    if (state && state !== tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid authorization state'
      });
    }

    await calendarService.exchangeCodeForTokens(code, tenantId);
    
    res.json({
      success: true,
      message: 'Google Calendar connected successfully'
    });
  } catch (error) {
    logger.error('Error handling calendar callback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect Google Calendar'
    });
  }
});

/**
 * Disconnect Google Calendar
 */
router.post('/disconnect', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    await calendarService.disconnectCalendar(tenantId);
    
    res.json({
      success: true,
      message: 'Google Calendar disconnected successfully'
    });
  } catch (error) {
    logger.error('Error disconnecting calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect calendar'
    });
  }
});

/**
 * Get available time slots for a specific date
 */
router.get('/availability/:date', authenticateToken, requireTenantAccess, requireActiveSubscription, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { date } = req.params;
    const { duration = 60 } = req.query;

    // Validate date format
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Don't allow past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot check availability for past dates'
      });
    }

    const availableSlots = await calendarService.getAvailableSlots(
      tenantId, 
      targetDate, 
      parseInt(duration)
    );
    
    res.json({
      success: true,
      date: date,
      duration: parseInt(duration),
      slots: availableSlots.map(slot => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        available: slot.available,
        formatted_time: slot.start.toLocaleTimeString('en-ZA', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Africa/Johannesburg'
        })
      }))
    });
  } catch (error) {
    logger.error('Error getting availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get availability'
    });
  }
});

/**
 * Create consultation appointment
 */
router.post('/appointments', authenticateToken, requireTenantAccess, requireActiveSubscription, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const {
      client_name,
      client_email,
      client_phone,
      legal_issue,
      start_time,
      duration = 60,
      attorney_email,
      notes = ''
    } = req.body;

    // Validate required fields
    if (!client_name || !client_email || !legal_issue || !start_time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: client_name, client_email, legal_issue, start_time'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(client_email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate appointment time is in the future
    const appointmentTime = new Date(start_time);
    if (appointmentTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment time must be in the future'
      });
    }

    const appointmentData = {
      clientName: client_name,
      clientEmail: client_email,
      clientPhone: client_phone,
      legalIssue: legal_issue,
      startTime: start_time,
      duration: parseInt(duration),
      attorneyEmail: attorney_email,
      notes: notes
    };

    const appointment = await calendarService.createConsultationAppointment(
      tenantId, 
      appointmentData
    );
    
    res.json({
      success: true,
      appointment: appointment,
      message: 'Consultation appointment created successfully'
    });
  } catch (error) {
    logger.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment'
    });
  }
});

/**
 * Get upcoming appointments for tenant
 */
router.get('/appointments', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { limit = 10 } = req.query;

    const appointments = await calendarService.getUpcomingAppointments(
      tenantId, 
      parseInt(limit)
    );
    
    res.json({
      success: true,
      appointments: appointments.map(appointment => ({
        id: appointment.id,
        client_name: appointment.client_name,
        client_email: appointment.client_email,
        client_phone: appointment.client_phone,
        legal_issue: appointment.legal_issue,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        status: appointment.status,
        meeting_link: appointment.meeting_link,
        notes: appointment.notes,
        created_at: appointment.created_at
      }))
    });
  } catch (error) {
    logger.error('Error getting appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments'
    });
  }
});

/**
 * Update appointment status
 */
router.patch('/appointments/:appointmentId', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updates = { status };
    if (notes !== undefined) {
      updates.notes = notes;
    }

    await calendarService.updateAppointment(tenantId, appointmentId, updates);
    
    res.json({
      success: true,
      message: `Appointment ${status} successfully`
    });
  } catch (error) {
    logger.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment'
    });
  }
});

/**
 * Get appointment details
 */
router.get('/appointments/:appointmentId', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { appointmentId } = req.params;

    const db = getDatabase();
    const appointment = await db('appointments')
      .where({
        calendar_event_id: appointmentId,
        tenant_id: tenantId
      })
      .first();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      appointment: {
        id: appointment.id,
        client_name: appointment.client_name,
        client_email: appointment.client_email,
        client_phone: appointment.client_phone,
        legal_issue: appointment.legal_issue,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        status: appointment.status,
        meeting_link: appointment.meeting_link,
        notes: appointment.notes,
        created_at: appointment.created_at,
        updated_at: appointment.updated_at
      }
    });
  } catch (error) {
    logger.error('Error getting appointment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment details'
    });
  }
});

/**
 * Get calendar integration statistics
 */
router.get('/stats', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const db = getDatabase();

    const stats = await db('appointments')
      .where('tenant_id', tenantId)
      .select(
        db.raw('COUNT(*) as total_appointments'),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as scheduled', ['scheduled']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as completed', ['completed']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as cancelled', ['cancelled']),
        db.raw('COUNT(CASE WHEN start_time >= ? THEN 1 END) as upcoming', [new Date()])
      )
      .first();

    const isConnected = await calendarService.isCalendarConnected(tenantId);

    res.json({
      success: true,
      calendar_connected: isConnected,
      statistics: {
        total_appointments: parseInt(stats.total_appointments) || 0,
        scheduled: parseInt(stats.scheduled) || 0,
        completed: parseInt(stats.completed) || 0,
        cancelled: parseInt(stats.cancelled) || 0,
        upcoming: parseInt(stats.upcoming) || 0
      }
    });
  } catch (error) {
    logger.error('Error getting calendar stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get calendar statistics'
    });
  }
});

module.exports = router;