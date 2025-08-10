<script setup lang="ts">
import type { ParkingRecord, VehicleInfo } from "@/@type/historyParking";
import { ref } from "vue";

interface Props {
    listParkingHistory: ParkingRecord[];
}

interface Emits {
    (event: "detailHistoryParking", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showHistory = ref<boolean[]>([]);

watch(
    () => props.listParkingHistory,
    (newVal) => {
        showHistory.value = newVal.map(() => false);
    },
    { immediate: true, deep: true }
);

function toggleShowHistory(index: number) {
    showHistory.value[index] = !showHistory.value[index];
}

const goToDetail = (licensePlate: string) => {
    emit("detailHistoryParking", licensePlate);
};
</script>

<template>
    <div class="p-6">
        <h1 class="mb-4 text-2xl font-bold">Lịch sử bãi đổ xe</h1>

        <!-- LIST CARS -->
        <div v-if="listParkingHistory.length" class="grid grid-cols-1 gap-4">
            <div v-for="(parkingRecord, index) in listParkingHistory" :key="index" class="p-4 bg-white border rounded shadow-sm">
                <div @click="toggleShowHistory(index)" class="cursor-pointer">
                    <h2 class="text-lg font-semibold text-blue-600">Ngày: {{ parkingRecord.date }}</h2>
                </div>

                <!-- TABLE HISTORY -->
                <div v-if="showHistory[index]" class="mt-4">
                    <table class="w-full text-sm border border-collapse table-auto">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="p-2 border">Biển số xe</th>
                                <th class="p-2 border">Số lần vào</th>
                                <th class="p-2 border">Số lần ra</th>
                                <th class="p-2 border">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="parkingRecord.vehicles.length === 0">
                                <td colspan="4" class="p-2 italic text-center text-gray-500 border">
                                    Không có xe nào được gửi trong ngày này
                                </td>
                            </tr>
                            <tr
                                v-else
                                v-for="(vehicle, rIndex) in parkingRecord.vehicles"
                                :key="rIndex"
                                class="text-center hover:bg-gray-100"
                            >
                                <td class="p-2 border">{{ vehicle.licensePlate ?? "---" }}</td>
                                <td class="p-2 border">{{ vehicle.solanvao ?? "---" }}</td>
                                <td class="p-2 border">{{ vehicle.solanra ?? "---" }}</td>
                                <td class="p-2 border">
                                    <button
                                        class="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        @click="goToDetail(vehicle.licensePlate)"
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- NO CAR -->
        <div v-else class="text-gray-500">Không có ngày nào được gửi xe.</div>

        <!-- PAGINATION
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
        </div> -->
    </div>
</template>
