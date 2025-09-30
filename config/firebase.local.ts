// Firebase configuration for local development with emulators
export const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "localhost",
  projectId: "zipparents-local",
  storageBucket: "zipparents-local.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  // Emulator settings
  useEmulators: true,
  emulatorPorts: {
    auth: 9099,
    firestore: 8080,
    storage: 9199,
    functions: 5001,
  },
};
