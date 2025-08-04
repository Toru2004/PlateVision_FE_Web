<script setup lang="ts">
import SideMenu from '@/components/organisms/SideMenu.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Container chính có ảnh nền -->
    <div
      class="flex grow relative z-0 bg-no-repeat bg-cover bg-center"
      style="background-image: url('/HLF.jpg'); background-position: 100px 100%;"
    >
      <!-- Lớp overlay đen mờ -->
      <div class="absolute inset-0 bg-black/5 z-0"></div>

      <!-- Nội dung chính (SideMenu + NuxtPage) -->
      <div class="flex grow relative z-10 w-full">
        <!-- Sidebar -->
        <SideMenu />

        <!-- Nội dung trang -->
        <div class="flex-1 flex flex-col px-4 py-6 overflow-y-auto">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>
