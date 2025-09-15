# Firebase Geofence Query Server - Deployment Guide

This guide will help you deploy your Geofence Query Server to Firebase Hosting and Functions.

## Prerequisites

1. **Firebase CLI**: Install the Firebase CLI globally

   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Project**: Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

3. **Authentication**: Login to Firebase
   ```bash
   firebase login
   ```

## Setup Steps

### 1. Configure Firebase Project

1. Update `.firebaserc` with your actual Firebase project ID:

   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```

2. Update `firebase.json` if needed (default configuration should work for most cases)

### 2. Environment Variables (Optional)

If you're using environment variables for Firebase configuration, create a `.env` file in the functions directory:

```bash
# functions/.env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..
```

## Deployment Options

### Option 1: Quick Deployment (Recommended)

Use the provided deployment script:

```bash
npm run deploy
```

This will:

- Install all dependencies
- Build TypeScript functions
- Deploy both hosting and functions to Firebase

### Option 2: Manual Deployment

Deploy hosting and functions separately:

```bash
# Deploy only hosting (static files)
npm run deploy:hosting

# Deploy only functions (API endpoints)
npm run deploy:functions

# Or deploy everything
firebase deploy
```

### Option 3: Build Functions Only

If you only need to build the TypeScript functions:

```bash
npm run build:functions
```

## Local Development

### Run Local Server

```bash
npm run dev
```

### Run Firebase Emulators

```bash
npm run emulator
```

This will start:

- Firebase Hosting emulator (usually at http://localhost:5000)
- Firebase Functions emulator (usually at http://localhost:5001)

## Features After Deployment

Once deployed, your application will have:

### 🌐 Web Interface

- Access at: `https://your-project-id.web.app`
- Modern, responsive UI for querying geofence logs
- Statistics dashboard
- Advanced search capabilities
- Data export functionality

### 🔧 API Endpoints

All API endpoints will be available at: `https://your-project-id.web.app/api/`

- `GET /api/health` - Health check
- `GET /api/logs` - Get all logs with pagination
- `GET /api/logs/event-type/:eventType` - Filter by event type
- `GET /api/logs/user/:userId` - Filter by user ID
- `GET /api/logs/platform/:platform` - Filter by platform
- `GET /api/logs/date-range` - Filter by date range
- `GET /api/logs/last-hours/:hours` - Get logs from last N hours
- `GET /api/stats` - Get statistics
- `POST /api/logs/search` - Advanced search with multiple filters
- `GET /api/event-types` - Get available event types
- `GET /api/platforms` - Get available platforms
- `GET /api/users` - Get unique users
- `POST /api/clear-data` - Clear all data (with confirmation)

### 🗑️ Data Management

- **Clear All Data**: Safely delete all geofence logs with confirmation
- **Confirmation Required**: Must type "DELETE" to confirm data deletion
- **Safety Features**: Multiple warnings and confirmations

## Troubleshooting

### Common Issues

1. **Build Errors**: Make sure all dependencies are installed

   ```bash
   cd functions && npm install
   ```

2. **Permission Errors**: Ensure you're logged in to Firebase

   ```bash
   firebase login
   ```

3. **Project ID Issues**: Verify your project ID in `.firebaserc`

4. **Function Timeout**: Firebase Functions have a 60-second timeout limit

### Logs and Debugging

View function logs:

```bash
firebase functions:log
```

View hosting logs:

```bash
firebase hosting:channel:list
```

## Security Considerations

1. **API Security**: The API endpoints are public. Consider adding authentication if needed.

2. **Data Deletion**: The clear data endpoint requires confirmation but is still accessible to anyone with the URL.

3. **Firebase Rules**: Ensure your Firestore security rules are properly configured.

## Cost Considerations

- **Firebase Hosting**: Free tier includes 10GB storage and 10GB transfer
- **Firebase Functions**: Free tier includes 2M invocations per month
- **Firestore**: Free tier includes 1GB storage and 50K reads/writes per day

## Support

For issues or questions:

1. Check the Firebase documentation
2. Review the function logs
3. Test locally with emulators first

## Next Steps

After successful deployment:

1. Test all API endpoints
2. Verify the web interface works correctly
3. Test the clear data functionality (carefully!)
4. Set up monitoring and alerts if needed
5. Consider adding authentication for production use
