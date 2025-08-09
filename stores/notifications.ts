import { defineStore } from "pinia";

export const useNotificationsStore = defineStore("notifications", {
    state: () => ({
        notifications: [] as { title?: string; body?: string }[],
    }),
    actions: {
        addNotification(n: { title?: string; body?: string }) {
            this.notifications.push(n);
            setTimeout(() => {
                this.notifications.shift();
            }, 5000); // tự ẩn sau 5s
        },
    },
});
