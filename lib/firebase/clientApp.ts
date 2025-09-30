import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

// Get the appropriate config based on environment
const getFirebaseConfig = () => {
  const env = process.env.NEXT_PUBLIC_FIREBASE_ENV || 'local';

  switch (env) {
    case 'prod':
      return require('@/config/firebase.prod').firebaseConfig;
    case 'dev':
      return require('@/config/firebase.dev').firebaseConfig;
    case 'local':
    default:
      return require('@/config/firebase.local').firebaseConfig;
  }
};

let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

export const initializeFirebase = () => {
  const config = getFirebaseConfig();

  // Initialize Firebase app if not already initialized
  if (!getApps().length) {
    firebaseApp = initializeApp(config);
  } else {
    firebaseApp = getApps()[0];
  }

  // Initialize services
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);

  // Connect to emulators if using local environment
  if (config.useEmulators && typeof window !== 'undefined') {
    try {
      connectAuthEmulator(auth, `http://localhost:${config.emulatorPorts.auth}`, {
        disableWarnings: true,
      });
      connectFirestoreEmulator(db, 'localhost', config.emulatorPorts.firestore);
      connectStorageEmulator(storage, 'localhost', config.emulatorPorts.storage);
      console.log('✅ Connected to Firebase emulators');
    } catch (error) {
      console.log('Emulators already connected or error:', error);
    }
  }

  return { app: firebaseApp, auth, db, storage };
};

// Initialize on import
const firebase = initializeFirebase();

export { firebase };
export const { app, db, storage } = firebase;
export { auth };
