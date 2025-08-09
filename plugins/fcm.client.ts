import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseApp } from "@/plugins/firebase"; // file init firebase của bạn
import { useNotificationsStore } from "../stores/notifications"; // nếu dùng Pinia/Vuex

export default defineNuxtPlugin(() => {
    if (typeof window !== "undefined") {
        const messaging = getMessaging(firebaseApp);

        onMessage(messaging, (payload) => {
            console.log("📩 Foreground message:", payload);

            // Ví dụ: cập nhật store để hiển thị UI
            const store = useNotificationsStore();
            store.addNotification({
                title: payload.notification?.title,
                body: payload.notification?.body,
            });
        });
    }
});
