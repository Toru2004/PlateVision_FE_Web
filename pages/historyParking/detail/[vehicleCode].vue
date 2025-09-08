<template>
    <div>
        <div class="p-4">
            <!-- Nút quay lại -->
            <div class="mb-4">
                <button @click="goBack" class="flex items-center text-blue-600 transition-colors hover:text-blue-800">
                    <Icon name="ArrowLeft" class="w-5 h-5 mr-2" />
                    <span class="font-medium">Quay lại</span>
                </button>
            </div>

            <!-- Tiêu đề biển số -->
            <h1 class="text-2xl font-bold text-gray-800">
                Nhật ký hoạt động
            </h1>
        </div>

        <div v-if="parkingDate && !timelineLoading" class="space-y-6">
            <!-- Thông tin chung -->
            <div class="bg-white p-5 rounded-2xl shadow">
                <p class="text-lg font-semibold text-gray-800">
                    {{ vehicleTypeTitle }} biển số
                    <strong class="text-indigo-600">{{ licensePlate }}</strong>
                    vào ngày
                    <strong>{{ formatDate(parkingDate) }}</strong>
                </p>
                <div class="mt-2 flex gap-6 text-gray-700">
                    <p>Số lần vào: <strong>{{ solanvao }}</strong></p>
                    <p>Số lần ra: <strong>{{ solanra }}</strong></p>
                </div>
            </div>

            <!-- Timeline dọc -->
            <div>
                <h3 class="mb-3 text-xl font-bold text-gray-800">Danh sách Timeline</h3>
                <div class="relative border-l border-gray-300 ml-4">
                    <div v-for="(item, index) in timelines" :key="item.id" class="mb-10 ml-6">
                        <!-- Nút số thứ tự -->
                        <span
                            class="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full ring-4 ring-white text-white text-xs font-bold">
                            {{ index + 1 }}
                        </span>

                        <!-- Nội dung card -->
                        <div class="bg-white p-5 rounded-xl shadow border border-gray-100">
                            <!-- Giờ -->
                            <div class="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                                <p><strong>Giờ vào:</strong> {{ item.timein }}</p>
                                <p><strong>Giờ ra:</strong> {{ item.timeout }}</p>
                            </div>

                            <!-- Hình ảnh -->
                            <div class="flex flex-wrap gap-4">
                                <!-- Biển số -->
                                <div v-if="item.biensoxevao" class="w-auto max-w-[120px] space-y-1">
                                    <ImageViewer :src="item.biensoxevao" class="rounded-lg border" />
                                    <p class="text-xs text-center text-gray-600">Biển số xe vào</p>
                                </div>
                                <div v-if="item.biensoxera" class="w-auto max-w-[120px] space-y-1">
                                    <ImageViewer :src="item.biensoxera" class="rounded-lg border" />
                                    <p class="text-xs text-center text-gray-600">Biển số xe ra</p>
                                </div>

                                <!-- Motorbike -->
                                <template v-if="vehicleType === 'motorbike'">
                                    <div v-if="item.khuonmatvao" class="w-auto max-w-[120px] space-y-1">
                                        <ImageViewer :src="item.khuonmatvao" class="rounded-lg border" />
                                        <p class="text-xs text-center text-gray-600">Khuôn mặt vào</p>
                                    </div>
                                    <div v-if="item.khuonmatra" class="w-auto max-w-[120px] space-y-1">
                                        <ImageViewer :src="item.khuonmatra" class="rounded-lg border" />
                                        <p class="text-xs text-center text-gray-600">Khuôn mặt ra</p>
                                    </div>
                                </template>

                                <!-- Car -->
                                <template v-else-if="vehicleType === 'car'">
                                    <div v-if="item.hinhxevao" class="w-auto max-w-[120px] space-y-1">
                                        <ImageViewer :src="item.hinhxevao" class="rounded-lg border" />
                                        <p class="text-xs text-center text-gray-600">Hình xe vào</p>
                                    </div>
                                    <div v-if="item.hinhxera" class="w-auto max-w-[120px] space-y-1">
                                        <ImageViewer :src="item.hinhxera" class="rounded-lg border" />
                                        <p class="text-xs text-center text-gray-600">Hình xe ra</p>
                                    </div>
                                    <div v-if="item.logovao" class="w-auto max-w-[120px] space-y-1">
                                        <ImageViewer :src="item.logovao" class="rounded-lg border" />
                                        <p class="text-xs text-center text-gray-600">Logo vào</p>
                                    </div>
                                    <div v-if="item.logora" class="w-auto max-w-[120px] space-y-1">
                                        <ImageViewer :src="item.logora" class="rounded-lg border" />
                                        <p class="text-xs text-center text-gray-600">Logo ra</p>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useMultiVehicleData } from "@/components/firebase/useVehicleTimeline";
import ImageViewer from "@/utils/ImageViewer.vue";

import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/plugins/0.firebase.client";

const route = useRoute();
const router = useRouter();
const vehicleCode = route.params.vehicleCode as string;
const [licensePlate, vehicleType, parkingDate] = vehicleCode.split("_");

let vehicleTypeTransferred = "";
let vehicleTypeTitle = "";
if (vehicleType === "motorbike") {
    vehicleTypeTransferred = "xemay";
    vehicleTypeTitle = "Xe máy";
} else if (vehicleType === "car") {
    vehicleTypeTransferred = "xeoto";
    vehicleTypeTitle = "Xe ô tô";
}

const db = getFirestore(firebaseApp);

const { solanra, solanvao, timelines, timelineLoading, fetchVehicleDataByDate } = useMultiVehicleData(db, vehicleTypeTransferred);

function goBack() {
    router.back();
}

function formatDate(dateStr: string): string {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const day = dateStr.slice(0, 2);
    const month = dateStr.slice(2, 4);
    const year = dateStr.slice(4);
    return `${day}/${month}/${year}`;
}

onMounted(() => fetchVehicleDataByDate(licensePlate, parkingDate));
</script>

<style lang="scss" scoped></style>
