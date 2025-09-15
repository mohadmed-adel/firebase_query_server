#!/bin/bash

# Firebase Geofence Query Server Deployment Script
# This script deploys the application to Firebase Hosting and Functions

echo "🚀 Starting Firebase deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please login first:"
    echo "firebase login"
    exit 1
fi

# Install dependencies for functions
echo "📦 Installing function dependencies..."
cd functions
npm install
cd ..

# Build TypeScript functions
echo "🔨 Building TypeScript functions..."
cd functions
npm run build
cd ..

# Deploy to Firebase
echo "🌐 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"
echo "🔗 Your app is now live at: https://your-project-id.web.app"
echo "📊 Access the web interface and start querying your geofence logs!"
