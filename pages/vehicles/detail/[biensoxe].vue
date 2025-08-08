<template>
    <div>
        <div class="p-6">
    <!-- Nút quay lại -->
            <div class="mb-4">
            <button
                @click="goBack"
                class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
                <Icon name="ArrowLeft" class="mr-2 w-5 h-5" />
                <span class="font-medium">Quay lại</span>
            </button>
            </div>

            <!-- Tiêu đề biển số -->
            <h1 class="text-2xl font-bold text-gray-800 mb-6">
            Nhật ký hoạt động của xe <span class="text-blue-600">{{ biensoxe }}</span>
            </h1>

            <!-- Loading -->
            <div v-if="loading" class="text-gray-600 italic">
            Đang tải danh sách ngày hoạt động...
            </div>

            <!-- Danh sách ngày -->
            <div v-else class="flex flex-wrap gap-3">
            <button
                v-for="(date, index) in dates"
                :key="date"
                @click="selectDate(date)"
                class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 
                    hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                :class="{
                'bg-blue-500 text-white border-blue-500': selectedDate === date,
                'bg-white text-gray-800': selectedDate !== date
                }"
            >
                {{ date }}
            </button>
            </div>
        </div>

            <div v-if="selectedDate && !timelineLoading" class="mt-6 space-y-4">
                <p class="text-lg">
                    <strong>{{ biensoxe }}</strong> vào ngày <strong>{{ selectedDate }}</strong>:
                </p>
                <p>Số lần vào: <strong>{{ solanvao }}</strong></p>
                <p>Số lần ra: <strong>{{ solanra }}</strong></p>

                <div>
                    <h3 class="font-bold mb-2">Danh sách Timeline</h3>
                    <ul class="space-y-2">
                    <li
                        v-for="(item, index) in timelines"
                        :key="item.id"
                        class="border p-3 rounded bg-gray-50"
                    >
                        <p><strong>#{{ index + 1 }}</strong> - {{ item.id }}</p>
                        <p><strong>Giờ vào:</strong> {{ item.timeIn }}</p>
                        <p><strong>Giờ ra:</strong> {{ item.timeOut }}</p>
                        <div class="flex flex-wrap gap-3 mt-2">
                        <ImageViewer v-if="item.imageIn" :src="item.imageIn" />
                        <ImageViewer v-if="item.imageOut" :src="item.imageOut" />
                        
                        <ImageViewer v-if="item.hinhdauxevao" :src="item.hinhdauxevao" />
                        <ImageViewer v-if="item.hinhdauxera" :src="item.hinhdauxera" />
                        <!-- <img :src="item.hinhdauxevao" alt="Hình đầu vào" class="w-32 h-20 object-cover border" v-if="item.hinhdauxevao" />
                        <img :src="item.hinhdauxera" alt="Hình đầu ra" class="w-32 h-20 object-cover border" v-if="item.hinhdauxera" /> -->
                        </div>
                    </li>
                    </ul>
                </div>
                </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useDateList } from '@/components/vehicles/dateList.vue';
import { useVehicleData } from '@/components/firebase/useVehicleTimeline';
import ImageViewer from '@/utils/ImageViewer.vue';
const route = useRoute();
const router = useRouter();
const biensoxe = route.params.biensoxe as string;
const { dates, loading } = useDateList();
const selectedDate = ref<string | null>(null);
const {
  solanra,
  solanvao,
  timelines,
  timelineLoading,
  fetchVehicleDataByDate
} = useVehicleData();

function goBack() {
    router.back();
}
async function selectDate(date: string) {
  selectedDate.value = date;
  await fetchVehicleDataByDate(biensoxe, date);
}
</script>

<style lang="scss" scoped>

</style>