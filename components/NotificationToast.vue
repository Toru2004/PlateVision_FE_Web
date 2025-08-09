<template>
    <div v-if="notifications.length" class="fixed space-y-3 top-5 right-5">
        <div v-for="(n, index) in notifications" :key="index" class="px-4 py-3 text-white bg-blue-600 rounded shadow-lg">
            <strong>{{ n.title }}</strong>
            <p>{{ n.body }}</p>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useNotificationsStore } from "@/stores/notifications";

const store = useNotificationsStore();
const { notifications } = storeToRefs(store);
</script>
