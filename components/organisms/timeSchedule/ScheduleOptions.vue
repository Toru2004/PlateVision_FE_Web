<script setup lang="ts">
import { Timestamp } from "firebase/firestore";

interface Props {
    isLoading: boolean;
    giaHan: boolean;
    selectedOption: "gio" | "ngay";
    gioiHanGio: number;
    gioiHanNgay: Timestamp;
    ghiChu: string;
}

const props = defineProps<Props>();
const showConfirmModal = ref(false);

const confirmSave = () => {
    showConfirmModal.value = true;
};

const handleConfirm = () => {
    emit("update:save");
    showConfirmModal.value = false;
};

const handleCancel = () => {
    showConfirmModal.value = false;
};

const emit = defineEmits<{
    (e: "update:giaHan", value: boolean): void;
    (e: "update:selectedOption", value: "gio" | "ngay"): void;
    (e: "update:ghiChu", value: string): void;
    (e: "update:save"): void;
}>();
</script>

<template>
    <div class="p-4 space-y-4 bg-white border rounded shadow">
        <h2 class="text-xl font-bold">Tùy chọn gia hạn lịch hẹn</h2>

        <div v-if="props.isLoading">Đang tải...</div>
        <div v-else class="space-y-4">
            <!-- Bật/tắt gia hạn -->
            <div class="flex items-center space-x-2">
                <label class="font-semibold">Mở gia hạn lịch hẹn:</label>
                <input type="checkbox" :checked="props.giaHan"
                    @change="emit('update:giaHan', ($event.target as HTMLInputElement).checked)" class="w-5 h-5" />
            </div>

            <!-- Tùy chọn giới hạn -->
            <div :class="{ 'opacity-50 pointer-events-none': !props.giaHan }" class="space-y-2">
                <!-- Giới hạn giờ -->
                <div class="flex items-center space-x-2">
                    <input type="radio" id="gio" value="gio" :checked="props.selectedOption === 'gio'"
                        @change="emit('update:selectedOption', 'gio')" :disabled="!props.giaHan" />
                    <label for="gio" class="font-semibold"> Giới hạn giờ ({{ props.gioiHanGio }}h) </label>
                </div>

                <!-- Giới hạn ngày -->
                <div class="flex items-center space-x-2">
                    <input type="radio" id="ngay" value="ngay" :checked="props.selectedOption === 'ngay'"
                        @change="emit('update:selectedOption', 'ngay')" :disabled="!props.giaHan" />
                    <label for="ngay" class="font-semibold">
                        Giới hạn ngày ({{ props.gioiHanNgay.toDate().toLocaleDateString("vi-VN") }})
                    </label>
                </div>
            </div>

            <!-- Ghi chú gia hạn -->
            <div class="space-y-1">
                <label for="ghiChu" class="font-semibold block">Chỉnh sửa ghi chú gia hạn:</label>
                <textarea id="ghiChu" rows="3" class="w-full p-2 border rounded resize-none" :value="props.ghiChu"
                    @input="emit('update:ghiChu', ($event.target as HTMLTextAreaElement).value)"
                    placeholder="Nhập ghi chú liên quan đến gia hạn lịch hẹn..."></textarea>
            </div>

            <!-- Nút lưu -->
            <button @click="confirmSave" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                Lưu thay đổi
            </button>
        </div>
    </div>
    <!-- Modal xác nhận -->
    <div v-if="showConfirmModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 class="text-lg font-semibold mb-4">Xác nhận lưu thay đổi</h3>
            <p class="mb-6">Bạn có chắc chắn muốn lưu các thay đổi đã thực hiện?</p>
            <div class="flex justify-end space-x-3">
                <button @click="handleCancel" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    Hủy
                </button>
                <button @click="handleConfirm" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Xác nhận
                </button>
            </div>
        </div>
    </div>
</template>
