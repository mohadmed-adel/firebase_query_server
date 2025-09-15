const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const GeofenceQueryService = require('./geofence-queries');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize query service
const queryService = new GeofenceQueryService();

// Routes

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all logs with pagination
app.get('/api/logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const startAfter = req.query.startAfter || null;
    
    const result = await queryService.getAllLogs(limit, startAfter);
    res.json(result);
  } catch (error) {
    console.error('Error in /api/logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get logs by event type
app.get('/api/logs/event-type/:eventType', async (req, res) => {
  try {
    const { eventType } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    
    const logs = await queryService.getLogsByEventType(eventType, limit);
    res.json(logs);
  } catch (error) {
    console.error(`Error in /api/logs/event-type/${req.params.eventType}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get logs by user ID
app.get('/api/logs/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    
    const logs = await queryService.getLogsByUserId(userId, limit);
    res.json(logs);
  } catch (error) {
    console.error(`Error in /api/logs/user/${req.params.userId}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get logs by platform
app.get('/api/logs/platform/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    
    const logs = await queryService.getLogsByPlatform(platform, limit);
    res.json(logs);
  } catch (error) {
    console.error(`Error in /api/logs/platform/${req.params.platform}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get logs by date range
app.get('/api/logs/date-range', async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Both startDate and endDate are required (YYYY-MM-DD format)' 
      });
    }
    
    const logs = await queryService.getLogsByDateRange(startDate, endDate, parseInt(limit));
    res.json(logs);
  } catch (error) {
    console.error('Error in /api/logs/date-range:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get logs from last N hours
app.get('/api/logs/last-hours/:hours', async (req, res) => {
  try {
    const { hours } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    
    const logs = await queryService.getLogsFromLastHours(parseInt(hours), limit);
    res.json(logs);
  } catch (error) {
    console.error(`Error in /api/logs/last-hours/${req.params.hours}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await queryService.getStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Error in /api/stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Complex query with multiple filters
app.post('/api/logs/search', async (req, res) => {
  try {
    const { filters, limit = 100 } = req.body;
    
    const logs = await queryService.getLogsWithFilters(filters, parseInt(limit));
    res.json(logs);
  } catch (error) {
    console.error('Error in /api/logs/search:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available event types
app.get('/api/event-types', async (req, res) => {
  try {
    const stats = await queryService.getStatistics();
    res.json(Object.keys(stats.eventTypes));
  } catch (error) {
    console.error('Error in /api/event-types:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available platforms
app.get('/api/platforms', async (req, res) => {
  try {
    const stats = await queryService.getStatistics();
    res.json(Object.keys(stats.platforms));
  } catch (error) {
    console.error('Error in /api/platforms:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get unique users
app.get('/api/users', async (req, res) => {
  try {
    const stats = await queryService.getStatistics();
    res.json(stats.users);
  } catch (error) {
    console.error('Error in /api/users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear all data
app.post('/api/clear-data', async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (!confirm) {
      return res.status(400).json({ 
        error: 'Confirmation required. Send { "confirm": true } to clear all data.' 
      });
    }

    const result = await queryService.clearAllData();
    res.json(result);
  } catch (error) {
    console.error('Error in /api/clear-data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Geofence Logs Query Server'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Geofence Logs Query Server running on http://localhost:${PORT}`);
  console.log(`📊 Access the web interface at http://localhost:${PORT}`);
  console.log(`🔍 API endpoints available at http://localhost:${PORT}/api/`);
});

module.exports = app;
