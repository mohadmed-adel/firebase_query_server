const { initializeFirebase } = require('./firebase-config');

class GeofenceQueryService {
  constructor() {
    this.db = initializeFirebase();
  }

  // Get all geofence logs with pagination
  async getAllLogs(limit = 100, startAfter = null) {
    try {
      let query = this.db.collection('geofence_essential_logs')
        .orderBy('timestamp', 'desc')
        .limit(limit);

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      const snapshot = await query.get();
      const logs = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        });
      });

      return {
        logs,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === limit
      };
    } catch (error) {
      console.error('Error getting all logs:', error);
      throw error;
    }
  }

  // Get logs by event type
  async getLogsByEventType(eventType, limit = 100) {
    try {
      // Use the same approach as getLogsWithFilters to avoid index issues
      // Get all logs ordered by timestamp and filter in memory
      const snapshot = await this.db.collection('geofence_essential_logs')
        .orderBy('timestamp', 'desc')
        .limit(1000) // Get more data to filter from
        .get();

      const logs = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        });
      });

      // Filter by eventType in memory
      const filteredLogs = logs.filter(log => log.eventType === eventType);
      
      // Apply limit after filtering
      return filteredLogs.slice(0, limit);
    } catch (error) {
      console.error(`Error getting logs for event type ${eventType}:`, error);
      throw error;
    }
  }

  // Get logs by user ID
  async getLogsByUserId(userId, limit = 100) {
    try {
      // Use the same approach to avoid index issues
      // Get all logs ordered by timestamp and filter in memory
      const snapshot = await this.db.collection('geofence_essential_logs')
        .orderBy('timestamp', 'desc')
        .limit(1000) // Get more data to filter from
        .get();

      const logs = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        });
      });

      // Filter by userId in memory
      const filteredLogs = logs.filter(log => log.userId === userId);
      
      // Apply limit after filtering
      return filteredLogs.slice(0, limit);
    } catch (error) {
      console.error(`Error getting logs for user ${userId}:`, error);
      throw error;
    }
  }

  // Get logs by platform
  async getLogsByPlatform(platform, limit = 100) {
    try {
      // Use the same approach to avoid index issues
      // Get all logs ordered by timestamp and filter in memory
      const snapshot = await this.db.collection('geofence_essential_logs')
        .orderBy('timestamp', 'desc')
        .limit(1000) // Get more data to filter from
        .get();

      const logs = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        });
      });

      // Filter by platform in memory
      const filteredLogs = logs.filter(log => log.platform === platform);
      
      // Apply limit after filtering
      return filteredLogs.slice(0, limit);
    } catch (error) {
      console.error(`Error getting logs for platform ${platform}:`, error);
      throw error;
    }
  }

  // Get logs by date range
  async getLogsByDateRange(startDate, endDate, limit = 100) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const snapshot = await this.db.collection('geofence_essential_logs')
        .where('timestamp', '>=', start)
        .where('timestamp', '<=', end)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const logs = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        });
      });

      return logs;
    } catch (error) {
      console.error('Error getting logs by date range:', error);
      throw error;
    }
  }

  // Get logs from the last N hours
  async getLogsFromLastHours(hours = 24, limit = 100) {
    try {
      const hoursAgo = new Date();
      hoursAgo.setHours(hoursAgo.getHours() - hours);

      const snapshot = await this.db.collection('geofence_essential_logs')
        .where('timestamp', '>=', hoursAgo)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const logs = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        });
      });

      return logs;
    } catch (error) {
      console.error(`Error getting logs from last ${hours} hours:`, error);
      throw error;
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const snapshot = await this.db.collection('geofence_essential_logs').get();
      
      const stats = {
        totalLogs: snapshot.size,
        eventTypes: {},
        platforms: {},
        users: new Set(),
        dateRange: {
          earliest: null,
          latest: null
        }
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        
        // Count event types
        stats.eventTypes[data.eventType] = (stats.eventTypes[data.eventType] || 0) + 1;
        
        // Count platforms
        stats.platforms[data.platform] = (stats.platforms[data.platform] || 0) + 1;
        
        // Collect unique users
        if (data.userId) {
          stats.users.add(data.userId);
        }
        
        // Track date range
        const timestamp = data.timestamp.toDate();
        if (!stats.dateRange.earliest || timestamp < stats.dateRange.earliest) {
          stats.dateRange.earliest = timestamp;
        }
        if (!stats.dateRange.latest || timestamp > stats.dateRange.latest) {
          stats.dateRange.latest = timestamp;
        }
      });

      // Convert Set to Array and format dates
      stats.users = Array.from(stats.users);
      stats.dateRange.earliest = stats.dateRange.earliest?.toISOString();
      stats.dateRange.latest = stats.dateRange.latest?.toISOString();

      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }

  // Complex query with multiple filters
  async getLogsWithFilters(filters = {}, limit = 100) {
    try {
      console.log('🔍 Advanced search filters:', filters);
      
      // Get all logs and filter everything in memory to avoid any Firestore index issues
      let query = this.db.collection('geofence_essential_logs');

      // Don't apply any database-level filters - get all data and filter in memory
      query = query.orderBy('timestamp', 'desc').limit(1000);

      const snapshot = await query.get();
      const logs = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        });
      });

      console.log(`📊 Found ${logs.length} total logs before filtering`);

      // Apply all filters in memory
      let filteredLogs = logs;
      
      if (filters.eventType) {
        filteredLogs = filteredLogs.filter(log => log.eventType === filters.eventType);
        console.log(`📊 After eventType filter (${filters.eventType}): ${filteredLogs.length} logs`);
      }
      
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
        console.log(`📊 After userId filter (${filters.userId}): ${filteredLogs.length} logs`);
      }
      
      if (filters.platform) {
        filteredLogs = filteredLogs.filter(log => log.platform === filters.platform);
        console.log(`📊 After platform filter (${filters.platform}): ${filteredLogs.length} logs`);
      }

      // Apply date filters in memory
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate);
        console.log(`📊 After startDate filter (${filters.startDate}): ${filteredLogs.length} logs`);
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        // Add one day to endDate to include the entire end date
        endDate.setDate(endDate.getDate() + 1);
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) < endDate);
        console.log(`📊 After endDate filter (${filters.endDate}): ${filteredLogs.length} logs`);
      }

      // Apply limit after filtering
      filteredLogs = filteredLogs.slice(0, limit);
      
      console.log(`📊 Final result: ${filteredLogs.length} logs`);
      return filteredLogs;
    } catch (error) {
      console.error('Error getting logs with filters:', error);
      throw error;
    }
  }

  // Clear all geofence data
  async clearAllData() {
    try {
      console.log('🗑️ Starting to clear all geofence data...');
      
      const collectionRef = this.db.collection('geofence_essential_logs');
      const snapshot = await collectionRef.get();
      
      if (snapshot.empty) {
        console.log('📭 No data to clear');
        return { deletedCount: 0, message: 'No data found to clear' };
      }

      const batch = this.db.batch();
      let deletedCount = 0;
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
        deletedCount++;
      });

      await batch.commit();
      
      console.log(`✅ Successfully deleted ${deletedCount} documents`);
      return {
        deletedCount,
        message: `Successfully cleared ${deletedCount} geofence log entries`
      };
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      throw error;
    }
  }
}

module.exports = GeofenceQueryService;
