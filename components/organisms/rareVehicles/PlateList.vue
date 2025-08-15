<script setup lang="ts">
interface XeInfo {
    id: string;
    bienso: string;
    image: string | null;
    timeIn: any;
    timeOut: any;
    uutien: boolean;
}

defineProps<{
    danhSachXe: XeInfo[];
    isLoading: boolean;
    isAdding: boolean;
    newBienso: string;
    newUutien: boolean;
    searchKeyword: string;
    hasNext: boolean;
    showConfirmModal: boolean;
}>();

const emit = defineEmits([
    "update:new-bienso",
    "update:new-uutien",
    "update:search-keyword",
    "update:show-confirm-modal",
    "add-xe",
    "fetch-page",
]);
</script>

<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Danh sách xe</h1>

        <!-- Form thêm xe -->
        <div class="mb-6 p-4 border rounded bg-gray-50">
            <h2 class="font-semibold mb-2">Thêm xe mới</h2>
            <div class="flex items-center gap-2 mb-2">
                <input :value="newBienso" @input="emit('update:new-bienso', ($event.target as HTMLInputElement).value)"
                    placeholder="Nhập biển số..." class="border px-3 py-2 rounded w-60" />
                <label class="flex items-center gap-1">
                    <input type="checkbox" :checked="newUutien"
                        @change="emit('update:new-uutien', ($event.target as HTMLInputElement).checked)" />
                    Xe ưu tiên
                </label>

                <div class="ml-auto">
                    <button @click="emit('update:show-confirm-modal', true)" :disabled="isAdding"
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                        {{ isAdding ? "Đang thêm..." : "Thêm xe" }}
                    </button>
                </div>
            </div>

            <!-- Ô tìm kiếm -->
            <h2 class="font-semibold mb-2">Tìm kiếm xe</h2>
            <div class="mt-4">
                <input :value="searchKeyword"
                    @input="emit('update:search-keyword', ($event.target as HTMLInputElement).value)" type="text"
                    placeholder="Tìm kiếm biển số..." class="border px-3 py-2 rounded w-full" />
            </div>
        </div>

        <!-- Danh sách xe -->
        <div v-if="isLoading && !danhSachXe.length">Đang tải dữ liệu...</div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="xe in danhSachXe" :key="xe.id" class="border rounded-lg p-4 shadow bg-white">
                <p class="font-bold text-lg">Biển số: {{ xe.bienso }}</p>

                <img v-if="xe.image" :src="xe.image" alt="Ảnh xe" class="w-full h-40 object-cover mt-2 rounded" />
                <div v-else class="w-full h-40 bg-gray-200 flex items-center justify-center mt-2 rounded">
                    Không có ảnh
                </div>

                <p class="mt-2">
                    Vào: {{ xe.timeIn?.toDate?.().toLocaleString("vi-VN") || "---" }}
                </p>
                <p>
                    Ra: {{ xe.timeOut?.toDate?.().toLocaleString("vi-VN") || "---" }}
                </p>
                <p class="mt-1">
                    Ưu tiên:
                    <span :class="xe.uutien ? 'text-green-600 font-semibold' : 'text-gray-500'
                        ">
                        {{ xe.uutien ? "Có" : "Không" }}
                    </span>
                </p>
            </div>
        </div>

        <!-- Nút tải thêm -->
        <div class="mt-4 flex justify-center">
            <button @click="emit('fetch-page', true)" :disabled="!hasNext || isLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                {{ isLoading ? "Đang tải..." : hasNext ? "Tải thêm" : "Hết dữ liệu" }}
            </button>
        </div>

        <!-- Modal xác nhận -->
        <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded shadow-lg w-96">
                <h2 class="text-lg font-semibold mb-4">Xác nhận thêm xe</h2>
                <p>Biển số: <strong>{{ newBienso }}</strong></p>
                <p>Ưu tiên: <strong>{{ newUutien ? "Có" : "Không" }}</strong></p>
                <div class="flex justify-end gap-2 mt-4">
                    <button @click="emit('update:show-confirm-modal', false)" class="px-4 py-2 border rounded">
                        Hủy
                    </button>
                    <button @click="emit('add-xe')" class="px-4 py-2 bg-blue-600 text-white rounded">
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
