<script setup lang="ts">
import SideMenu from '@/components/organisms/SideMenu.vue';
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <div class="flex grow">
      <!-- Sidebar -->
      <SideMenu />
      <!-- Main content -->
      <div class="flex-1 flex flex-col px-4 py-6 overflow-y-auto">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
