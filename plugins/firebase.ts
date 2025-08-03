/* eslint-disable no-console */
import { getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import type { FirebaseOptions } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig: FirebaseOptions = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    databaseURL: config.public.firebaseDatabaseURL as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    projectId: config.public.firebaseProjectId as string,
    appId: config.public.firebaseAppId as string,
    measurementId: config.public.firebaseMeasurementId as string,
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  const firebaseStorage = getStorage(app);
  const firebaseDatabase = getDatabase(app);
  const firestore = getFirestore(app);

  nuxtApp.provide('firebaseStorage', firebaseStorage);
  nuxtApp.provide('firebaseDatabase', firebaseDatabase);
  nuxtApp.provide('firestore', firestore);
});

declare module 'nuxt/app' {
  interface NuxtApp {
    $firebaseStorage: FirebaseStorage;
    $firebaseDatabase: ReturnType<typeof getDatabase>;
    $firestore: Firestore;
  }
}
