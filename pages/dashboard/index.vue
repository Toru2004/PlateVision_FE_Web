<script setup lang="ts">
definePageMeta({
  layout: 'default',
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <!-- Card 1 -->
      <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
        <p class="text-gray-500 text-sm">Tổng số người dùng</p>
        <p class="text-2xl font-bold text-blue-600 mt-2">1,250</p>
      </div>

      <!-- Card 2 -->
      <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
        <p class="text-gray-500 text-sm">Số đơn hôm nay</p>
        <p class="text-2xl font-bold text-green-600 mt-2">87</p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
        <p class="text-gray-500 text-sm">Tỉ lệ hoàn thành</p>
        <p class="text-2xl font-bold text-purple-600 mt-2">93%</p>
      </div>

      <!-- Card 4 -->
      <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
        <p class="text-gray-500 text-sm">Hệ thống</p>
        <p class="text-2xl font-bold text-red-600 mt-2">Ổn định</p>
      </div>
    </div>

    <!-- Section khác -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Biểu đồ hoặc bảng thống kê</h2>
      <div class="bg-white p-6 rounded-xl shadow text-gray-500 text-center">
        (Chèn biểu đồ hoặc table ở đây sau)
      </div>
    </div>
  </div>
</template>
