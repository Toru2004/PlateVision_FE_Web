<script setup lang="ts">
import TopBar from '@/components/organisms/TopBar.vue'
import SideMenu from '@/components/organisms/SideMenu.vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <transition name="slide">
      <SideMenu v-if="isSidebarOpen" class="w-64 bg-gray-800 text-white" />
    </transition>

    <!-- Right content -->
    <div class="flex flex-col flex-1">
      <!-- TopBar -->
      <TopBar @toggle="toggleSidebar" />

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto px-4 py-6 bg-gray-100">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
