const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getDatabase } = require('../config/db');
const calendarService = require('../services/calendarService');
const logger = require('../utils/logger');

/**
 * Start Google Calendar OAuth flow
 */
router.get('/auth/google', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const authUrl = calendarService.generateAuthUrl(tenantId);
    
    res.json({
      success: true,
      authUrl: authUrl
    });
  } catch (error) {
    logger.error('Error starting calendar auth:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start calendar authorization'
    });
  }
});

/**
 * Handle Google Calendar OAuth callback
 */
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, state: tenantId } = req.query;
    
    if (!code || !tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Missing authorization code or tenant ID'
      });
    }

    // Exchange code for tokens
    const tokens = await calendarService.exchangeCodeForTokens(code, tenantId);
    
    // Redirect to dashboard with success message
    res.redirect(`http://localhost:3001/dashboard?calendar=connected`);
  } catch (error) {
    logger.error('Error in calendar callback:', error);
    res.redirect(`http://localhost:3001/dashboard?calendar=error&message=${encodeURIComponent(error.message)}`);
  }
});

/**
 * Get calendar connection status
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const isConnected = await calendarService.isCalendarConnected(tenantId);
    
    let upcomingAppointments = [];
    if (isConnected) {
      upcomingAppointments = await calendarService.getUpcomingAppointments(tenantId, 5);
    }

    res.json({
      success: true,
      connected: isConnected,
      upcomingAppointments: upcomingAppointments
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
 * Get available time slots for a specific date
 */
router.get('/slots', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { date, duration = 60 } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const slots = await calendarService.getAvailableSlots(tenantId, new Date(date), parseInt(duration));
    
    res.json({
      success: true,
      date: date,
      slots: slots.map(slot => ({
        start: slot.start,
        end: slot.end,
        available: slot.available
      }))
    });
  } catch (error) {
    logger.error('Error getting available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available slots'
    });
  }
});

/**
 * Book a consultation appointment
 */
router.post('/appointments', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const {
      clientName,
      clientEmail,
      clientPhone,
      legalIssue,
      startTime,
      duration = 60,
      attorneyEmail,
      notes
    } = req.body;

    if (!clientName || !clientEmail || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Client name, email, and start time are required'
      });
    }

    const appointment = await calendarService.createConsultationAppointment(tenantId, {
      clientName,
      clientEmail,
      clientPhone,
      legalIssue,
      startTime,
      duration,
      attorneyEmail,
      notes
    });

    res.json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: appointment
    });
  } catch (error) {
    logger.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment'
    });
  }
});

/**
 * Update appointment status
 */
router.patch('/appointments/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { appointmentId } = req.params;
    const updates = req.body;

    await calendarService.updateAppointment(tenantId, appointmentId, updates);

    res.json({
      success: true,
      message: 'Appointment updated successfully'
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
 * Disconnect calendar integration
 */
router.delete('/integration', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    await calendarService.disconnectCalendar(tenantId);

    res.json({
      success: true,
      message: 'Calendar integration disconnected successfully'
    });
  } catch (error) {
    logger.error('Error disconnecting calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect calendar'
    });
  }
});

module.exports = router;