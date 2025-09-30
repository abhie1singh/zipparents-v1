/**
 * Environment Configuration Utility
 *
 * This utility helps switch between different Firebase environments:
 * - local: Uses Firebase emulators
 * - dev: Uses Firebase dev project
 * - prod: Uses Firebase production project
 */

export type Environment = 'local' | 'dev' | 'prod';

export const getEnvironment = (): Environment => {
  const env = process.env.NEXT_PUBLIC_FIREBASE_ENV as Environment;
  return env || 'local';
};

export const isLocal = () => getEnvironment() === 'local';
export const isDev = () => getEnvironment() === 'dev';
export const isProd = () => getEnvironment() === 'prod';

export const getFirebaseConfig = () => {
  const env = getEnvironment();

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

export const logEnvironmentInfo = () => {
  const env = getEnvironment();
  console.log('🌍 Environment:', env);
  console.log('🔥 Firebase Project:', getFirebaseConfig().projectId);

  if (isLocal()) {
    console.log('🧪 Using Firebase Emulators');
  }
};
