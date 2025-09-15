# Geofence Logs Query Server

A Node.js server application to query and analyze Firebase geofence logs from your AicTime app.

## Features

- 🎯 **Web Interface**: Beautiful, responsive web UI for querying logs
- 📊 **Statistics Dashboard**: View comprehensive statistics about your geofence data
- 🔍 **Advanced Search**: Filter logs by date range, event type, user, platform
- ⚡ **Quick Queries**: Pre-built queries for common use cases
- 📤 **Export Data**: Export results to JSON format
- 🗑️ **Data Management**: Clear all Firebase data with safety confirmations
- 🚀 **REST API**: Full REST API for programmatic access
- 🌐 **Firebase Hosting**: Deploy to Firebase Hosting and Functions

## Setup Instructions

### 1. Install Dependencies

```bash
cd firebase-query-server
npm install
```

### 2. Firebase Configuration

You have three options to configure Firebase:

#### Option A: Service Account Key (Recommended for local development)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate new private key**
5. Save the JSON file in the project directory
6. Copy `env.example` to `.env` and update:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY=./path/to/your-service-account-key.json
PORT=3000
```

#### Option B: Environment Variables (For deployment)

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
PORT=3000
```

#### Option C: Default Credentials (If using gcloud CLI)

```env
FIREBASE_PROJECT_ID=your-project-id
PORT=3000
```

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:3000`

## Usage

### Web Interface

1. Open `http://localhost:3000` in your browser
2. Use the **Statistics** section to get an overview
3. Use **Quick Queries** for common searches
4. Use **Advanced Search** for complex filtering
5. Export results as JSON when needed

### API Endpoints

#### Get All Logs

```bash
GET /api/logs?limit=100
```

#### Get Logs by Event Type

```bash
GET /api/logs/event-type/ENTER?limit=50
```

#### Get Logs by User

```bash
GET /api/logs/user/user123?limit=100
```

#### Get Logs by Platform

```bash
GET /api/logs/platform/Android?limit=100
```

#### Get Logs by Date Range

```bash
GET /api/logs/date-range?startDate=2024-01-01&endDate=2024-01-31&limit=100
```

#### Get Logs from Last N Hours

```bash
GET /api/logs/last-hours/24?limit=100
```

#### Get Statistics

```bash
GET /api/stats
```

#### Advanced Search

```bash
POST /api/logs/search
Content-Type: application/json

{
  "filters": {
    "eventType": "ENTER",
    "platform": "Android",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "limit": 100
}
```

#### Get Available Options

```bash
GET /api/event-types
GET /api/platforms
GET /api/users
```

#### Clear All Data

```bash
POST /api/clear-data
Content-Type: application/json

{
  "confirm": true
}
```

⚠️ **Warning**: This will permanently delete ALL geofence log data. Use with extreme caution!

## Event Types

Based on your geofence service, these are the main event types:

- **ENTER** - User entered a geofence
- **EXIT** - User exited a geofence
- **API_REQUEST** - API call initiated
- **API_RESPONSE** - API call completed
- **ERROR** - Any error occurred
- **INIT** - Geofence service initialized
- **LOCATION_MOCK_CHECK** - Location validation
- **NOTIFICATION** - Local notification shown
- **DATE_FILTER** - Geofence date filtering
- **CLEANUP** - Expired geofence cleanup
- **STARTUP_RESTORE** - Geofence restoration

## Data Structure

Each log entry contains:

```json
{
  "id": "document-id",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userId": "user123",
  "eventType": "ENTER",
  "message": "Geofence enter event detected",
  "platform": "Android",
  "apiData": {
    "isMocked": false,
    "latitude": 25.123456,
    "longitude": 55.123456,
    "accuracy": 10.5
  }
}
```

## Troubleshooting

### Common Issues

1. **Firebase Authentication Error**

   - Check your service account key file path
   - Verify the project ID is correct
   - Ensure the service account has Firestore permissions

2. **No Data Found**

   - Verify the collection name is `geofence_essential_logs`
   - Check if your app is actually writing logs to Firebase
   - Ensure the Firebase project is correct

3. **Permission Denied**
   - Make sure your service account has the `Cloud Datastore User` role
   - Check Firestore security rules

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages:

```bash
NODE_ENV=development npm start
```

## Security Notes

- Never commit your service account key to version control
- Use environment variables in production
- Consider using Firebase App Check for additional security
- Limit API access with proper authentication if needed

## Deployment

### Firebase Hosting (Recommended)

Deploy to Firebase Hosting and Functions for a fully managed solution:

```bash
# Quick deployment
npm run deploy

# Or manual deployment
firebase deploy
```

**Benefits:**

- ✅ Free hosting with generous limits
- ✅ Global CDN for fast loading
- ✅ Automatic HTTPS
- ✅ Serverless functions for API
- ✅ Built-in monitoring and logging

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Local Development

```bash
# Run locally
npm run dev

# Test with Firebase emulators
npm run emulator
```

### Other Deployment Options

#### Heroku

```bash
heroku create your-app-name
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_CLIENT_EMAIL=your-email
heroku config:set FIREBASE_PRIVATE_KEY="your-private-key"
git push heroku main
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for your projects!

# firebase_query_server
