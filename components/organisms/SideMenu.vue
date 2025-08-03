<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Quản lý người dùng', path: '/users' },
  { label: 'Quản lý xe', path: '/settings' },
  { label: 'Quản lý hoạt động bãi đỗ', path: '/settings' },
  { label: 'Quản lý gia hạn bãi đỗ xe', path: '/settings' },
  { label: 'Quản lý yêu cầu', path: '/settings' },
];

const isActive = (path: string) => route.path.startsWith(path);

const goTo = (path: string) => {
  if (route.path !== path) {
    router.push(path);
  }
};
</script>

<template>
  <aside class="hidden md:flex flex-col w-64 bg-[#1E293B] text-white shadow-lg">
    <div class="h-16 flex items-center justify-center border-b border-blue-800 bg-[#0F172A]">
      <span class="text-xl font-bold text-blue-400">PlateVision</span>
    </div>
    <nav class="flex-1 overflow-auto px-2 py-4 space-y-2">
      <ul class="space-y-1">
        <li
          v-for="item in menuItems"
          :key="item.path"
        >
          <button
            @click="goTo(item.path)"
            class="w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200"
            :class="isActive(item.path)
              ? 'bg-blue-600 text-white shadow-inner'
              : 'text-gray-300 hover:bg-blue-800 hover:text-white'"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>
