// // plugins/firebase.ts
// import { getApps, initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database";
// import { getStorage } from "firebase/storage";

// import type { FirebaseApp } from "firebase/app";

// let firebaseApp: FirebaseApp;

// // ⚠️ Plugin mặc định
// export default defineNuxtPlugin((nuxtApp) => {
//   const config = useRuntimeConfig();

//   // Chỉ khởi tạo nếu chưa có app
//   if (!getApps().length) {
//   const firebaseConfig = {
//     apiKey: config.public.firebaseApiKey,
//     authDomain: config.public.firebaseAuthDomain,
//     projectId: config.public.firebaseProjectId,
//     storageBucket: config.public.firebaseStorageBucket,
//     messagingSenderId: config.public.firebaseMessagingSenderId,
//     appId: config.public.firebaseAppId,
//     measurementId: config.public.firebaseMeasurementId,
//     databaseURL: config.public.firebaseDatabaseURL,
//   };

//   // 🔍 Log cấu hình
//   console.log("🛠️ Firebase config:", firebaseConfig);

//   firebaseApp = initializeApp(firebaseConfig);

//   // 🔍 Log firebaseApp sau khi init
//   console.log("✅ Firebase app initialized:", firebaseApp);
// } else {
//   firebaseApp = getApps()[0];
//   console.log("🔄 Reusing existing Firebase app:", firebaseApp);
// }

//   // Khởi tạo các dịch vụ Firebase
//   const firestore = getFirestore(firebaseApp);
//   const auth = getAuth(firebaseApp);
//   const database = getDatabase(firebaseApp);
//   const storage = getStorage(firebaseApp);

//   // Đăng ký các dịch vụ vào Nuxt app
//   nuxtApp.provide("firestore", firestore);
//   nuxtApp.provide("firebaseAuth", auth);
//   nuxtApp.provide("firebaseDatabase", database);
//   nuxtApp.provide("firebaseStorage", storage);
//   nuxtApp.provide("firebaseApp", firebaseApp);
// });

// // ✅ Export firebaseApp để file khác có thể dùng
// export { firebaseApp };
// plugins/firebase.ts
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from 'firebase/messaging'
import type { FirebaseApp } from "firebase/app";

let firebaseApp: FirebaseApp;

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId,
    databaseURL: config.public.firebaseDatabaseURL,
  };

  console.log("🛠️ Firebase config:", firebaseConfig);


  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    console.log("Firebase app initialized:", firebaseApp);
  } else {
    firebaseApp = getApps()[0];
    console.log("Reusing existing Firebase app:", firebaseApp);
  }

  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const database = getDatabase(firebaseApp);
  const storage = getStorage(firebaseApp);

  nuxtApp.provide("firestore", firestore);
  nuxtApp.provide("firebaseAuth", auth);
  nuxtApp.provide("firebaseDatabase", database);
  nuxtApp.provide("firebaseStorage", storage);
  nuxtApp.provide("firebaseApp", firebaseApp);

  if (process.client && 'serviceWorker' in navigator) {
    const supported = await isSupported()
    if (!supported) {
      console.warn("Trình duyệt không hỗ trợ FCM.")
      return
    }

    console.log("Bắt đầu lấy FCM token")
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      const messaging = getMessaging(firebaseApp)

      const vapidKey = config.public.firebaseVapidKey
      console.log("VAPID Key:", vapidKey)

      const currentToken = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      })

      if (currentToken) {
        console.log(" FCM Token:", currentToken)

      } else {
        console.warn(" Không lấy được token. Cần xin quyền.")
      }
      // Gửi token về server để lưu trữ
      await fetch('http://localhost:5000/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentToken }),
      });


      // Lắng nghe tin nhắn foreground
      onMessage(messaging, (payload) => {
        console.log("FCM Message received:", payload)

      })
    } catch (err) {
      console.error(" Lỗi khi xử lý Messaging:", err)
    }
  }
});


export { firebaseApp };

