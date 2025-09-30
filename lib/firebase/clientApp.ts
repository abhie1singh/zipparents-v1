'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

// Get the appropriate config based on environment
const getFirebaseConfig = () => {
  const env = process.env.NEXT_PUBLIC_FIREBASE_ENV || 'local';

  // Return config inline to avoid import issues
  if (env === 'prod') {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "zipparents-prod",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      useEmulators: false,
    };
  }

  if (env === 'dev') {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "zipparents-dev",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      useEmulators: false,
    };
  }

  // Local environment with emulators
  return {
    apiKey: "demo-api-key",
    authDomain: "localhost",
    projectId: "zipparents-local",
    storageBucket: "zipparents-local.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    useEmulators: true,
    emulatorPorts: {
      auth: 9099,
      firestore: 8080,
      storage: 9199,
      functions: 5001,
    },
  };
};

let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

export const initializeFirebase = () => {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    return { app: undefined, auth: undefined, db: undefined, storage: undefined };
  }

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
  if (config.useEmulators) {
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

// Lazy initialization - only call when needed
export const getFirebaseApp = () => {
  if (typeof window === 'undefined') return undefined;
  if (!firebaseApp) {
    initializeFirebase();
  }
  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (typeof window === 'undefined') return undefined;
  if (!auth) {
    initializeFirebase();
  }
  return auth;
};

export const getFirebaseDb = () => {
  if (typeof window === 'undefined') return undefined;
  if (!db) {
    initializeFirebase();
  }
  return db;
};

export const getFirebaseStorage = () => {
  if (typeof window === 'undefined') return undefined;
  if (!storage) {
    initializeFirebase();
  }
  return storage;
};
