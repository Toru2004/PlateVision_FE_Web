// plugins/firebase.ts
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

import type { FirebaseApp, FirebaseOptions } from "firebase/app";

let firebaseApp: FirebaseApp;

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const firebaseConfig: FirebaseOptions = {
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        projectId: config.public.firebaseProjectId,
        storageBucket: config.public.firebaseStorageBucket,
        messagingSenderId: config.public.firebaseMessagingSenderId,
        appId: config.public.firebaseAppId,
        measurementId: config.public.firebaseMeasurementId,
        databaseURL: config.public.firebaseDatabaseURL,
    };

    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    const firestore = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    const database = getDatabase(firebaseApp);
    const storage = getStorage(firebaseApp);

    nuxtApp.provide("firestore", firestore);
    nuxtApp.provide("firebaseAuth", auth);
    nuxtApp.provide("firebaseDatabase", database);
    nuxtApp.provide("firebaseStorage", storage);
});

export { firebaseApp };
