/**
 * Firebase Admin SDK Utility
 *
 * Provides Firebase Admin SDK initialization and helper functions for seeding
 */

import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Environment type
type Environment = 'local' | 'dev' | 'prod';

// Global admin instance
let adminInitialized = false;

/**
 * Initialize Firebase Admin SDK
 */
export function initializeAdmin(env: Environment = 'local'): admin.app.App {
  if (adminInitialized) {
    return admin.app();
  }

  console.log(`Initializing Firebase Admin for environment: ${env}`);

  if (env === 'local') {
    // Local emulator
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';

    admin.initializeApp({
      projectId: 'zipparents-local',
    });
  } else if (env === 'dev') {
    // Dev environment
    const serviceAccountPath = path.join(
      process.cwd(),
      'firebase-service-account-dev.json'
    );

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error('Dev service account key not found. Please add firebase-service-account-dev.json');
    }

    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'zipparents-dev.appspot.com',
    });
  } else if (env === 'prod') {
    // Production environment
    const serviceAccountPath = path.join(
      process.cwd(),
      'firebase-service-account-prod.json'
    );

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error('Prod service account key not found. Please add firebase-service-account-prod.json');
    }

    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'zipparents-prod.appspot.com',
    });
  }

  adminInitialized = true;
  console.log('✅ Firebase Admin initialized successfully');

  return admin.app();
}

/**
 * Get Firestore instance
 */
export function getFirestore(): admin.firestore.Firestore {
  if (!adminInitialized) {
    initializeAdmin();
  }
  return admin.firestore();
}

/**
 * Get Auth instance
 */
export function getAuth(): admin.auth.Auth {
  if (!adminInitialized) {
    initializeAdmin();
  }
  return admin.auth();
}

/**
 * Get Storage instance
 */
export function getStorage(): admin.storage.Storage {
  if (!adminInitialized) {
    initializeAdmin();
  }
  return admin.storage();
}

/**
 * Batch write helper
 */
export async function batchWrite(
  operations: Array<{
    collection: string;
    docId?: string;
    data: any;
  }>
): Promise<void> {
  const db = getFirestore();
  const batchSize = 500; // Firestore batch limit

  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = db.batch();
    const currentBatch = operations.slice(i, i + batchSize);

    for (const op of currentBatch) {
      const docRef = op.docId
        ? db.collection(op.collection).doc(op.docId)
        : db.collection(op.collection).doc();

      batch.set(docRef, op.data);
    }

    await batch.commit();
    console.log(`  Wrote batch ${Math.floor(i / batchSize) + 1} (${currentBatch.length} documents)`);
  }
}

/**
 * Create user with Auth and Firestore
 */
export async function createUser(data: {
  email: string;
  password: string;
  displayName: string;
  emailVerified?: boolean;
  disabled?: boolean;
}): Promise<{ uid: string; email: string }> {
  const auth = getAuth();
  const db = getFirestore();

  try {
    // Create auth user
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
      emailVerified: data.emailVerified ?? false,
      disabled: data.disabled ?? false,
    });

    // Create Firestore user document
    await db.collection('users').doc(userRecord.uid).set({
      email: data.email,
      displayName: data.displayName,
      emailVerified: data.emailVerified ?? false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { uid: userRecord.uid, email: data.email };
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      // User already exists, get their UID
      const existingUser = await auth.getUserByEmail(data.email);
      return { uid: existingUser.uid, email: data.email };
    }
    throw error;
  }
}

/**
 * Delete collection
 */
export async function deleteCollection(
  collectionPath: string,
  batchSize: number = 500
): Promise<void> {
  const db = getFirestore();
  const collectionRef = db.collection(collectionPath);

  const query = collectionRef.limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(
  db: admin.firestore.Firestore,
  query: admin.firestore.Query,
  resolve: () => void
): Promise<void> {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

/**
 * Set custom claims for user
 */
export async function setUserClaims(uid: string, claims: Record<string, any>): Promise<void> {
  const auth = getAuth();
  await auth.setCustomUserClaims(uid, claims);
}

/**
 * Delete all users from Auth
 */
export async function deleteAllAuthUsers(): Promise<void> {
  const auth = getAuth();
  let pageToken: string | undefined;
  let totalDeleted = 0;

  do {
    const listResult = await auth.listUsers(1000, pageToken);
    const uids = listResult.users.map(user => user.uid);

    if (uids.length > 0) {
      await auth.deleteUsers(uids);
      totalDeleted += uids.length;
      console.log(`  Deleted ${uids.length} auth users (total: ${totalDeleted})`);
    }

    pageToken = listResult.pageToken;
  } while (pageToken);
}

/**
 * Get document count
 */
export async function getCollectionCount(collectionPath: string): Promise<number> {
  const db = getFirestore();
  const snapshot = await db.collection(collectionPath).count().get();
  return snapshot.data().count;
}

/**
 * Check if document exists
 */
export async function documentExists(collectionPath: string, docId: string): Promise<boolean> {
  const db = getFirestore();
  const doc = await db.collection(collectionPath).doc(docId).get();
  return doc.exists;
}

/**
 * Progress logger
 */
export class ProgressLogger {
  private total: number;
  private current: number = 0;
  private startTime: number;

  constructor(total: number, private name: string) {
    this.total = total;
    this.startTime = Date.now();
  }

  increment(count: number = 1): void {
    this.current += count;
    const percentage = Math.round((this.current / this.total) * 100);
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    process.stdout.write(
      `\r  ${this.name}: ${this.current}/${this.total} (${percentage}%) - ${elapsed}s`
    );

    if (this.current >= this.total) {
      console.log(); // New line when complete
    }
  }

  complete(): void {
    this.current = this.total;
    this.increment(0);
    console.log(`✅ ${this.name} complete!`);
  }
}

/**
 * Save credentials to file
 */
export function saveCredentials(
  credentials: Array<{ email: string; password: string; role?: string }>,
  filename: string = 'seed-credentials.json'
): void {
  const filePath = path.join(process.cwd(), filename);
  fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
  console.log(`✅ Credentials saved to ${filename}`);
}

/**
 * Load credentials from file
 */
export function loadCredentials(filename: string = 'seed-credentials.json'): any[] {
  const filePath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Get environment from CLI args
 */
export function getEnvironment(): Environment {
  const env = process.env.FIREBASE_ENV || process.argv[2] || 'local';

  if (!['local', 'dev', 'prod'].includes(env)) {
    console.warn(`Unknown environment: ${env}, defaulting to 'local'`);
    return 'local';
  }

  return env as Environment;
}

/**
 * Confirm action (for destructive operations)
 */
export async function confirmAction(message: string): Promise<boolean> {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readline.question(`${message} (yes/no): `, (answer: string) => {
      readline.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}
