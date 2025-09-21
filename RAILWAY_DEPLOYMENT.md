# Railway.com Deployment Guide

This guide explains how to deploy your Firebase Query Server to Railway.com without exposing sensitive credentials.

## Prerequisites

1. A Railway.com account
2. Your Firebase project credentials
3. This repository connected to Railway.com

## Step 1: Set up Environment Variables in Railway

In your Railway.com dashboard, go to your project and add these environment variables:

### Required Environment Variables

**IMPORTANT**: Copy these exact values from your `firebase-service-account-key.json` file:

```
FIREBASE_PROJECT_ID=proven-entropy-369911
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-gocwl@proven-entropy-369911.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCV1KyoRfuPYL4v\n6FojNMZCLfuy2OFcKWioxd5q6bLctCtlQyHS5q0wASRvYTq0EdbqUvUChvBsLP7p\n7p6UHpUTATbqegq1mpgiJvglMzdw4YkCTfYLEW8WOw4BfG1SoblgHgkfWdwE8vqF\n9No9JZ3jQG/3/WwHjrkjoVUTUGq5K7onEQgiTGfKxV459PGBtZLhVpVDEpbAPVTs\nD6BD7ot9BqiASfrJhkYiwz8vkijDHSYTqfOTQBE7EalvMPAKtNPR2OXNjl85Vigq\n0SXpeS+X0mOIwhqxmX6/ATmxl/UHNgcCM04CFuh8gJVWlFLcTL+FUUHDZ7gRIDcc\ncoMW2rC3AgMBAAECggEAMiCTG0E+pntxZcnQzlKLufx0ZyOUUicwcrawcQh65MgK\ndLh/CnZOnu7i57iZ0UDerErQ2eWXbjmnl1BUEa4hpdgULWJjTtrH5zUudBOsisGJ\n+xFmLdHJXqCnUOv2D104DeY+mxSPPcCk/Egs86QwLKWUUF2i1Ox1GGyTcADJk+WA\nIMQ2P4EMiho5Zjh+XnHZxVdGfDxDx8F74clfG2gJzH2j6QiFpslzOh3K8cRwcI/d\n3byAKT4KVNwpKLmjSC52PNZa5sDdIdFDrKG8/ecVVZIiFzvS26LQHLJSW+Qx9hUc\nA3YgauKvt/8wTgRR5TM87wX6FQ+ZbWVGWpDqTwpiMQKBgQC8tJHBVx+xUNodmDAn\nNrcBN9ATVLQnM/AXcdLQVlv9ztc9Qgb7SKCKZqrn5csLkGmTlliw67yRjIjogU5o\nznd+wFE0SG0arLcBjZnRUQoiJEZtSLM6yeui/bsBVQQELKvGHQhm9CrQRyiL23PR\nj1S6+iPOoJG10yhzaCgPi7quVQKBgQDLQyMG9F/f+zq5AKVsLSYfn8Cbh6NMZ3ZF\nxpTh/ilvbzCm397uC3luEs9PJMvsCCzajmIHHJI9BtfMJp6BhDAWVPAxhM5HV+/D\n7s/1cXWrfDFi40LafmpaUxkR4FG93+X55pEowMe0y0WWBKie5G9vQYRZq8t+t1Dy\nJtxXAjtW2wKBgCbfG1c0VzbzbLrD6sdpIfGCSb5xqFqa/E4YCFEaOQDjZrsbqsyA\nfXGFDJeQYm8TZGwegE6RgNqKlHkwibJVNZBKlW+rq63e/iO3w4O2qdu2lTtVynXF\numBs2+S+WoFxokDBIkXy7g7RWazVm9oDKHULqeyabumBgcekIPxy0BWxAoGBAId5\nF79q4PvH1ju30olnDiHFt/nxTUV/L7URxelaHQPIeATA8TR3MVfL8aAuRjvqtvp0\nK6HRySYjiXDnzH1GPUalFfHrMhEa6xML+E7+cA77l27xSX2XBAtvlyXy/Igw0nbc\n1aLz2icF1DtIn5pHZn4gjLW3asnqJGlAvVrAggxBAoGAMClidZw/7B5pkX8LH5C2\n27xaxwXJGQkDSb2xShkOI4zGKsb8/0yQNxzWWu/R3Wtw19N1vA/84E5q+HBRVKY0\noxa13VD53OwOOeUCl7L8S9pxvZr1rYhjFLBjQ5/hzqZkfyBubHg644QTWxpo72WB\nqCpit+kyp8m6jqF8S2+5XVQ=\n-----END PRIVATE KEY-----\n"
```

**Note**: Make sure to include the quotes around the FIREBASE_PRIVATE_KEY value and keep the `\n` characters as they are.

### Optional Environment Variables

```
PORT=3000
```

## Step 2: Deploy to Railway

1. Connect your GitHub repository to Railway.com
2. Railway will automatically detect this as a Node.js project
3. The deployment will use the environment variables you set in Step 1
4. Railway will automatically run `npm install` and start your server

## Step 3: Verify Deployment

Once deployed, your server will be available at the Railway-provided URL. You can test it by visiting:

- `https://your-app.railway.app/api/health` - Health check endpoint
- `https://your-app.railway.app/` - Web interface
- `https://your-app.railway.app/api/logs` - API endpoint

## Troubleshooting

### Error: "Could not load the default credentials"

This error means Firebase is trying to use default credentials instead of your environment variables. Check the following:

1. **Verify Environment Variables**: In Railway dashboard, make sure all three variables are set:

   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

2. **Check Private Key Format**: The `FIREBASE_PRIVATE_KEY` must:

   - Be wrapped in quotes
   - Include the full private key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - Have `\n` characters preserved (don't convert to actual newlines)

3. **Redeploy**: After setting environment variables, trigger a new deployment

4. **Check Logs**: Look at Railway deployment logs for Firebase initialization messages:
   ```
   🔧 Initializing Firebase...
   🔍 Environment check:
     - FIREBASE_PROJECT_ID: ✅ Set
     - FIREBASE_CLIENT_EMAIL: ✅ Set
     - FIREBASE_PRIVATE_KEY: ✅ Set
   ✅ Firebase initialized with environment variables
   ```

### Common Issues

- **Missing quotes**: `FIREBASE_PRIVATE_KEY=-----BEGIN...` ❌
- **Correct format**: `FIREBASE_PRIVATE_KEY="-----BEGIN..."` ✅
- **Wrong newlines**: Converting `\n` to actual line breaks ❌
- **Correct newlines**: Keeping `\n` as literal characters ✅

## Security Notes

✅ **DO:**

- Use environment variables for sensitive data
- Keep your service account key file local only
- Never commit credentials to git

❌ **DON'T:**

- Upload `firebase-service-account-key.json` to Railway
- Commit sensitive files to your repository
- Share your private keys in plain text

## Local Development

For local development, you can still use the `firebase-service-account-key.json` file by:

1. Copy `.env.example` to `.env`
2. Set `FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account-key.json` in your `.env` file
3. Run `npm start`

The application will automatically detect and use the appropriate authentication method.
