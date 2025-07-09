
// Firebase services are intentionally not initialized.
// This file is kept to avoid breaking imports in other parts of the app,
// but the services will be undefined.

const FIREBASE_API_KEY = (typeof process !== 'undefined' && process.env && process.env.API_KEY)
  ? process.env.API_KEY
  : undefined;

// Log for debugging (will show API_KEY is present or not, but Firebase won't use it)
console.log("firebaseConfig: process.env.API_KEY available:", !!FIREBASE_API_KEY, "Value starts with:", FIREBASE_API_KEY?.substring(0,5));
console.warn("Firebase integration is currently DISABLED. All Firebase functionalities (auth, firestore, storage) will not work.");

// Export undefined/null for all Firebase services
const app = undefined;
const auth = undefined;
const db = undefined;
const storage = undefined;
const analytics = undefined;
const firebase = undefined; // Main firebase namespace also undefined

export { app, auth, db, storage, analytics, firebase };
