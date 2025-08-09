<template>
  <div v-if="notifications.length" class="fixed top-5 right-5 space-y-3">
    <div
      v-for="(n, index) in notifications"
      :key="index"
      class="bg-blue-600 text-white px-4 py-3 rounded shadow-lg"
    >
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
