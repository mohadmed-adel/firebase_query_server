const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin SDK
function initializeFirebase() {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      console.log('🔧 Initializing Firebase...');
      console.log('🔍 Environment check:');
      console.log('  - FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set');
      console.log('  - FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Not set');
      console.log('  - FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Not set');
      console.log('  - FIREBASE_SERVICE_ACCOUNT_KEY:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? '✅ Set' : '❌ Not set');

      let initialized = false;

      // Option 1: Use service account key file (if it exists and no env vars)
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && !process.env.FIREBASE_PRIVATE_KEY) {
        try {
          const serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY));
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID
          });
          console.log('✅ Firebase initialized with service account key file');
          initialized = true;
        } catch (error) {
          console.log('⚠️ Service account key file not found, trying other methods...');
        }
      }

      // Option 2: Use environment variables (for deployment) - PRIORITY
      if (!initialized && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
        try {
          const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: privateKey
            }),
            projectId: process.env.FIREBASE_PROJECT_ID
          });
          console.log('✅ Firebase initialized with environment variables');
          initialized = true;
        } catch (error) {
          console.error('❌ Failed to initialize with environment variables:', error.message);
        }
      }

      // Option 3: Use default credentials (for local development with gcloud)
      if (!initialized) {
        if (process.env.FIREBASE_PROJECT_ID) {
          admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID
          });
          console.log('✅ Firebase initialized with default credentials');
          initialized = true;
        } else {
          throw new Error('No Firebase configuration found. Please set FIREBASE_PROJECT_ID and either FIREBASE_PRIVATE_KEY/FIREBASE_CLIENT_EMAIL or FIREBASE_SERVICE_ACCOUNT_KEY');
        }
      }
    } else {
      console.log('✅ Firebase already initialized');
    }
    
    return admin.firestore();
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    throw error;
  }
}

module.exports = { initializeFirebase };
