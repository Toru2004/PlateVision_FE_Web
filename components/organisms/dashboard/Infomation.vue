<script setup lang="ts">
defineProps<{
  xeHienTai: number
  deltaXeHienTai: number
  xeRaVaoHomNay: number
  deltaXeRaVao: number
  soNguoiDangKy: number
  tongYeuCau: number
  deltaYeuCau: number
  tongLuotCongHoatDong: number
  trangThaiCong: boolean | null
}>()
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <!-- Grid cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <!-- Card: Xe đang gửi -->
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Xe đang gửi trong bãi</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ xeHienTai }}</p>
            <p v-if="deltaXeHienTai > 0" class="text-xs text-green-500 mt-1">
              +{{ deltaXeHienTai }} mới
            </p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="ri-car-fill text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card: Xe ra/vào hôm nay -->
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Xe ra/vào hôm nay</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ xeRaVaoHomNay }}</p>
            <p v-if="deltaXeRaVao > 0" class="text-xs text-green-500 mt-1">
              +{{ deltaXeRaVao }} mới
            </p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <i class="ri-exchange-fill text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card: Người đăng ký -->
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Tổng người đăng ký</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ soNguoiDangKy }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <i class="ri-user-add-fill text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card: Tổng yêu cầu -->
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Tổng yêu cầu mở cổng</p>
            <p class="text-3xl font-bold text-red-600 mt-2">{{ tongYeuCau }}</p>
            <p v-if="deltaYeuCau > 0" class="text-xs text-red-500 mt-1">
              +{{ deltaYeuCau }} mới
            </p>
          </div>
          <div class="p-3 bg-red-100 rounded-full">
            <i class="ri-door-open-fill text-red-600 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card: Tổng số lần cổng hoạt động -->
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Tổng số lần mở cổng</p>
            <p class="text-3xl font-bold text-orange-600 mt-2">{{ tongLuotCongHoatDong }}</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-full">
            <i class="ri-bar-chart-box-fill text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card: Trạng thái cổng -->
      <div class="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-gray-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Trạng thái cổng</p>
            <p
              class="text-3xl font-bold mt-2"
              :class="{
                'text-green-600': trangThaiCong === true,
                'text-red-600': trangThaiCong === false,
                'text-gray-400': trangThaiCong === null
              }"
            >
              {{
                trangThaiCong === null
                  ? 'Không xác định'
                  : trangThaiCong
                  ? 'Đang mở'
                  : 'Đang đóng'
              }}
            </p>
          </div>
          <div class="p-3 bg-gray-100 rounded-full">
            <i class="ri-lock-unlock-fill text-gray-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart section -->
    <div class="mt-10">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Thống kê hoạt động</h2>
      <div
        class="bg-white p-8 rounded-xl shadow border-2 border-dashed border-gray-300 text-gray-400 text-center"
      >
        (Biểu đồ hoặc bảng thống kê sẽ được hiển thị tại đây)
      </div>
    </div>
  </div>
</template>
