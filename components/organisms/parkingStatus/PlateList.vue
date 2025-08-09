<script setup lang="ts">
defineProps<{
    cars: {
        plate: string;
        canhbao?: boolean;
        timeExpired?: string;
        timestamp?: string;
        trangthai?: boolean;
    }[];
    gateStatus: boolean | null;
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
    searchTerm: string;
}>();

const emit = defineEmits<{
    (e: "update:searchTerm", value: string): void;
}>();
</script>

<template>
    <div class="p-6">
        <h1 class="mb-4 text-2xl font-bold">Trạng thái bãi đỗ xe</h1>

        <div class="flex items-center justify-between p-4 mb-4 bg-gray-100 border rounded">
            <div>
                <strong>Trạng thái cổng:</strong>
                <span :class="gateStatus ? 'text-green-600' : 'text-red-600'">
                    {{ gateStatus === null ? " Không rõ" : gateStatus ? " Mở" : " Đóng" }}
                </span>
            </div>
            <input
                type="text"
                class="px-4 py-2 text-base border rounded w-96"
                placeholder="Tìm kiếm biển số..."
                :value="searchTerm"
                @input="emit('update:searchTerm', ($event.target as HTMLInputElement).value)"
            />
        </div>

        <div v-if="cars.length" class="grid grid-cols-1 gap-4">
            <div v-for="(car, index) in cars" :key="index" class="p-4 bg-white border rounded shadow-sm">
                <h2 class="text-lg font-semibold text-blue-600">Biển số: {{ car.plate }}</h2>
                <ul class="mt-2 space-y-1 text-sm">
                    <li><strong>Cảnh báo:</strong> {{ car.canhbao ?? "NULL" }}</li>
                    <li><strong>Thời gian vào:</strong> {{ car.timestamp ?? "NULL" }}</li>
                    <li><strong>Hết hạn:</strong> {{ car.timeExpired ?? "NULL" }}</li>
                    <li><strong>Trạng thái:</strong> {{ car.trangthai ?? "NULL" }}</li>
                </ul>
            </div>
        </div>
        <div v-else class="text-gray-500">Không có xe nào trong bãi.</div>

        <!-- Pagination -->
        <div class="flex items-center justify-center mt-6 space-x-4">
            <button
                @click="onPrev"
                :disabled="currentPage === 1"
                class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
                Trước
            </button>
            <span>Trang {{ currentPage }} / {{ totalPages }}</span>
            <button
                @click="onNext"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
                Sau
            </button>
        </div>
    </div>
</template>
