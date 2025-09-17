"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
// Initialize Firebase Admin
admin.initializeApp();
const corsHandler = cors({ origin: true });
// Initialize Firestore
const db = admin.firestore();
// Geofence Query Service Class
class GeofenceQueryService {
    // Get all geofence logs with pagination
    async getAllLogs(limit = 100, startAfter = null) {
        try {
            let query = db.collection('geofence_essential_logs')
                .orderBy('timestamp', 'desc')
                .limit(limit);
            if (startAfter) {
                query = query.startAfter(startAfter);
            }
            const snapshot = await query.get();
            const logs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                logs.push(Object.assign(Object.assign({ id: doc.id }, data), { timestamp: data.timestamp.toDate().toISOString() }));
            });
            return {
                logs,
                lastDoc: snapshot.docs[snapshot.docs.length - 1],
                hasMore: snapshot.docs.length === limit
            };
        }
        catch (error) {
            console.error('Error getting all logs:', error);
            throw error;
        }
    }
    // Get logs by event type
    async getLogsByEventType(eventType, limit = 100) {
        try {
            const snapshot = await db.collection('geofence_essential_logs')
                .where('eventType', '==', eventType)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            const logs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                logs.push(Object.assign(Object.assign({ id: doc.id }, data), { timestamp: data.timestamp.toDate().toISOString() }));
            });
            return logs;
        }
        catch (error) {
            console.error(`Error getting logs for event type ${eventType}:`, error);
            throw error;
        }
    }
    // Get logs by user ID
    async getLogsByUserId(userId, limit = 100) {
        try {
            const snapshot = await db.collection('geofence_essential_logs')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            const logs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                logs.push(Object.assign(Object.assign({ id: doc.id }, data), { timestamp: data.timestamp.toDate().toISOString() }));
            });
            return logs;
        }
        catch (error) {
            console.error(`Error getting logs for user ${userId}:`, error);
            throw error;
        }
    }
    // Get logs by platform
    async getLogsByPlatform(platform, limit = 100) {
        try {
            console.log(`🔍 getLogsByPlatform called with platform: "${platform}"`);
            const snapshot = await db.collection('geofence_essential_logs')
                .where('platform', '==', platform)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            const logs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                logs.push(Object.assign(Object.assign({ id: doc.id }, data), { timestamp: data.timestamp.toDate().toISOString() }));
            });
            console.log(`📊 getLogsByPlatform found ${logs.length} logs for platform "${platform}"`);
            if (logs.length > 0) {
                console.log(`📊 Sample platforms in results:`, logs.slice(0, 3).map(log => `"${log.platform}"`));
            }
            return logs;
        }
        catch (error) {
            console.error(`Error getting logs for platform ${platform}:`, error);
            throw error;
        }
    }
    // Get logs by date range
    async getLogsByDateRange(startDate, endDate, limit = 100) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const snapshot = await db.collection('geofence_essential_logs')
                .where('timestamp', '>=', start)
                .where('timestamp', '<=', end)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            const logs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                logs.push(Object.assign(Object.assign({ id: doc.id }, data), { timestamp: data.timestamp.toDate().toISOString() }));
            });
            return logs;
        }
        catch (error) {
            console.error('Error getting logs by date range:', error);
            throw error;
        }
    }
    // Get logs from the last N hours
    async getLogsFromLastHours(hours = 24, limit = 100) {
        try {
            const hoursAgo = new Date();
            hoursAgo.setHours(hoursAgo.getHours() - hours);
            const snapshot = await db.collection('geofence_essential_logs')
                .where('timestamp', '>=', hoursAgo)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            const logs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                logs.push(Object.assign(Object.assign({ id: doc.id }, data), { timestamp: data.timestamp.toDate().toISOString() }));
            });
            return logs;
        }
        catch (error) {
            console.error(`Error getting logs from last ${hours} hours:`, error);
            throw error;
        }
    }
    // Get statistics
    async getStatistics() {
        var _a, _b;
        try {
            const snapshot = await db.collection('geofence_essential_logs').get();
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
            const usersArray = Array.from(stats.users);
            return {
                totalLogs: stats.totalLogs,
                eventTypes: stats.eventTypes,
                platforms: stats.platforms,
                users: usersArray,
                dateRange: {
                    earliest: (_a = stats.dateRange.earliest) === null || _a === void 0 ? void 0 : _a.toISOString(),
                    latest: (_b = stats.dateRange.latest) === null || _b === void 0 ? void 0 : _b.toISOString()
                }
            };
        }
        catch (error) {
            console.error('Error getting statistics:', error);
            throw error;
        }
    }
    // Complex query with multiple filters
    async getLogsWithFilters(filters = {}, limit = 100) {
        try {
            console.log('🔍 Advanced search filters:', filters);
            // Get all logs and filter everything in memory to avoid any Firestore index issues
            let query = db.collection('geofence_essential_logs')
                .orderBy('timestamp', 'desc')
                .limit(1000);
            const snapshot = await query.get();
            const logs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                logs.push(Object.assign(Object.assign({ id: doc.id }, data), { timestamp: data.timestamp.toDate().toISOString() }));
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
                console.log(`🔍 Platform filter requested: "${filters.platform}"`);
                console.log(`🔍 Sample platform values in data:`, logs.slice(0, 5).map(log => `"${log.platform}"`));
                filteredLogs = filteredLogs.filter(log => {
                    const matches = log.platform === filters.platform;
                    if (!matches && log.platform && filters.platform) {
                        console.log(`🔍 Platform mismatch: "${log.platform}" !== "${filters.platform}"`);
                    }
                    return matches;
                });
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
        }
        catch (error) {
            console.error('Error getting logs with filters:', error);
            throw error;
        }
    }
    // Clear all geofence data
    async clearAllData() {
        try {
            console.log('🗑️ Starting to clear all geofence data...');
            const collectionRef = db.collection('geofence_essential_logs');
            const snapshot = await collectionRef.get();
            if (snapshot.empty) {
                console.log('📭 No data to clear');
                return { deletedCount: 0, message: 'No data found to clear' };
            }
            const batch = db.batch();
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
        }
        catch (error) {
            console.error('❌ Error clearing data:', error);
            throw error;
        }
    }
}
// Initialize query service
const queryService = new GeofenceQueryService();
// API Function
exports.api = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, async () => {
        try {
            const path = req.path;
            const method = req.method;
            // Health check
            if (path === '/api/health' && method === 'GET') {
                return res.json({
                    status: 'OK',
                    timestamp: new Date().toISOString(),
                    service: 'Geofence Logs Query Server (Firebase Functions)'
                });
            }
            // Get all logs with pagination
            if (path === '/api/logs' && method === 'GET') {
                const limit = parseInt(req.query.limit) || 100;
                const startAfter = req.query.startAfter || null;
                const result = await queryService.getAllLogs(limit, startAfter || null);
                return res.json(result);
            }
            // Get logs by event type
            if (path.startsWith('/api/logs/event-type/') && method === 'GET') {
                const eventType = path.split('/')[4];
                const limit = parseInt(req.query.limit) || 100;
                const logs = await queryService.getLogsByEventType(eventType, limit);
                return res.json(logs);
            }
            // Get logs by user ID
            if (path.startsWith('/api/logs/user/') && method === 'GET') {
                const userId = path.split('/')[4];
                const limit = parseInt(req.query.limit) || 100;
                const logs = await queryService.getLogsByUserId(userId, limit);
                return res.json(logs);
            }
            // Get logs by platform
            if (path.startsWith('/api/logs/platform/') && method === 'GET') {
                const platform = path.split('/')[4];
                const limit = parseInt(req.query.limit) || 100;
                const logs = await queryService.getLogsByPlatform(platform, limit);
                return res.json(logs);
            }
            // Get logs by date range
            if (path === '/api/logs/date-range' && method === 'GET') {
                const { startDate, endDate, limit = 100 } = req.query;
                if (!startDate || !endDate) {
                    return res.status(400).json({
                        error: 'Both startDate and endDate are required (YYYY-MM-DD format)'
                    });
                }
                const logs = await queryService.getLogsByDateRange(startDate, endDate, parseInt(limit));
                return res.json(logs);
            }
            // Get logs from last N hours
            if (path.startsWith('/api/logs/last-hours/') && method === 'GET') {
                const hours = path.split('/')[4];
                const limit = parseInt(req.query.limit) || 100;
                const logs = await queryService.getLogsFromLastHours(parseInt(hours), limit);
                return res.json(logs);
            }
            // Get statistics
            if (path === '/api/stats' && method === 'GET') {
                const stats = await queryService.getStatistics();
                return res.json(stats);
            }
            // Complex query with multiple filters
            if (path === '/api/logs/search' && method === 'POST') {
                const { filters, limit = 100 } = req.body;
                const logs = await queryService.getLogsWithFilters(filters, parseInt(limit));
                return res.json(logs);
            }
            // Get available event types
            if (path === '/api/event-types' && method === 'GET') {
                const stats = await queryService.getStatistics();
                return res.json(Object.keys(stats.eventTypes));
            }
            // Get available platforms
            if (path === '/api/platforms' && method === 'GET') {
                const stats = await queryService.getStatistics();
                return res.json(Object.keys(stats.platforms));
            }
            // Get unique users
            if (path === '/api/users' && method === 'GET') {
                const stats = await queryService.getStatistics();
                return res.json(stats.users);
            }
            // Clear all data
            if (path === '/api/clear-data' && method === 'POST') {
                const { confirm } = req.body;
                if (!confirm) {
                    return res.status(400).json({
                        error: 'Confirmation required. Send { "confirm": true } to clear all data.'
                    });
                }
                const result = await queryService.clearAllData();
                return res.json(result);
            }
            // 404 for unknown routes
            return res.status(404).json({ error: 'Route not found' });
        }
        catch (error) {
            console.error('API Error:', error);
            return res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
});
//# sourceMappingURL=index.js.map