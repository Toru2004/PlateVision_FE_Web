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
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <!-- Card 1: Xe đang gửi -->
            <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <p class="text-gray-500 text-sm">
                    Xe đang gửi trong bãi
                    <span v-if="deltaXeHienTai > 0"> ({{ deltaXeHienTai }} mới)</span>
                </p>
                <p class="text-2xl font-bold text-blue-600 mt-2">{{ xeHienTai }}</p>
            </div>

            <!-- Card 2: Xe ra/vào hôm nay -->
            <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <p class="text-gray-500 text-sm">
                    Xe ra/vào hôm nay
                    <span v-if="deltaXeRaVao > 0"> ({{ deltaXeRaVao }} mới)</span>
                </p>
                <p class="text-2xl font-bold text-green-600 mt-2">{{ xeRaVaoHomNay }}</p>
            </div>

            <!-- Card 3: Số người đăng ký gửi xe -->
            <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <p class="text-gray-500 text-sm">Tổng người đăng ký gửi xe</p>
                <p class="text-2xl font-bold text-purple-600 mt-2">{{ soNguoiDangKy }}</p>
            </div>

            <!-- Card 4: Tổng yêu cầu -->
            <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <p class="text-gray-500 text-sm">
                    Tổng yêu cầu mở cổng
                    <span v-if="deltaYeuCau > 0"> ({{ deltaYeuCau }} mới)</span>
                </p>
                <p class="text-2xl font-bold text-red-600 mt-2">{{ tongYeuCau }}</p>
            </div>

            <!-- Card 5: Tổng số lần cổng hoạt động -->
            <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <p class="text-gray-500 text-sm">
                    Tổng số lần mở cổng
                </p>
                <p class="text-2xl font-bold text-red-600 mt-2">{{ tongLuotCongHoatDong }}</p>
            </div>

            <!-- Card 6: Trạng thái cổng -->
            <div class="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <p class="text-gray-500 text-sm">Trạng thái cổng</p>
                <p class="text-2xl font-bold mt-2" :class="{
                    'text-green-600': trangThaiCong === true,
                    'text-red-600': trangThaiCong === false,
                    'text-gray-400': trangThaiCong === null
                }">
                    {{
                        trangThaiCong === null
                            ? 'Không xác định'
                            : trangThaiCong
                    ? 'Đang mở'
                    : 'Đang đóng'
                    }}
                </p>
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