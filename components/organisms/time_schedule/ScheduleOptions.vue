<script setup lang="ts">
import { Timestamp } from "firebase/firestore";

interface Props {
    isLoading: boolean;
    giaHan: boolean;
    selectedOption: "gio" | "ngay";
    gioiHanGio: number;
    gioiHanNgay: Timestamp;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: "update:giaHan", value: boolean): void;
    (e: "update:selectedOption", value: "gio" | "ngay"): void;
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
                <input
                    type="checkbox"
                    :checked="props.giaHan"
                    @change="emit('update:giaHan', ($event.target as HTMLInputElement).checked)"
                    class="w-5 h-5"
                />
            </div>

            <!-- Tùy chọn giới hạn -->
            <div :class="{ 'opacity-50 pointer-events-none': !props.giaHan }" class="space-y-2">
                <!-- Giới hạn giờ -->
                <div class="flex items-center space-x-2">
                    <input
                        type="radio"
                        id="gio"
                        value="gio"
                        :checked="props.selectedOption === 'gio'"
                        @change="emit('update:selectedOption', 'gio')"
                        :disabled="!props.giaHan"
                    />
                    <label for="gio" class="font-semibold"> Giới hạn giờ ({{ props.gioiHanGio }}h) </label>
                </div>

                <!-- Giới hạn ngày -->
                <div class="flex items-center space-x-2">
                    <input
                        type="radio"
                        id="ngay"
                        value="ngay"
                        :checked="props.selectedOption === 'ngay'"
                        @change="emit('update:selectedOption', 'ngay')"
                        :disabled="!props.giaHan"
                    />
                    <label for="ngay" class="font-semibold">
                        Giới hạn ngày ({{ props.gioiHanNgay.toDate().toLocaleDateString("vi-VN") }})
                    </label>
                </div>
            </div>

            <!-- Nút lưu -->
            <button @click="emit('update:save')" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                Lưu thay đổi
            </button>
        </div>
    </div>
</template>
