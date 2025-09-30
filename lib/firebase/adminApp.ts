import * as admin from 'firebase-admin';

// Get the appropriate config based on environment
const getFirebaseAdminConfig = () => {
  const env = process.env.FIREBASE_ENV || 'local';

  if (env === 'local') {
    // For local development with emulators
    return {
      projectId: 'zipparents-local',
      useEmulators: true,
    };
  }

  // For dev/prod, use service account
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  return {
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
    useEmulators: false,
  };
};

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  const config = getFirebaseAdminConfig();

  const app = admin.initializeApp({
    credential: config.credential || admin.credential.applicationDefault(),
    projectId: config.projectId,
  });

  // Connect to emulators if using local environment
  if (config.useEmulators) {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
    console.log('✅ Firebase Admin connected to emulators');
  }

  return app;
};

export const adminApp = initializeFirebaseAdmin();
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
