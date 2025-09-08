<script setup lang="ts">
import type { ParkingRecord } from "@/@type/historyParking";
import { ref, watch } from "vue";
import VehicleTable from "@/components/organisms/historyParking/VehicleTable.vue";

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
  { immediate: true }
);

function toggleShowHistory(index: number) {
  showHistory.value[index] = !showHistory.value[index];
}

const goToDetail = (licensePlate: string) => {
  emit("detailHistoryParking", licensePlate);
};

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const day = dateStr.slice(0, 2);
  const month = dateStr.slice(2, 4);
  const year = dateStr.slice(4);
  return `${day}/${month}/${year}`;
}
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">Lịch sử bãi đổ xe</h1>

    <div v-if="listParkingHistory.length > 0" class="grid grid-cols-1 gap-4">
      <div
        v-for="(parkingRecord, index) in listParkingHistory"
        :key="index"
        class="p-4 bg-white border rounded shadow-sm"
      >
        <div @click="toggleShowHistory(index)" class="cursor-pointer">
          <h2 class="text-lg font-semibold text-blue-600">
            Ngày: {{ formatDate(parkingRecord.date) }}
          </h2>
        </div>

        <div v-if="showHistory[index]" class="mt-4 space-y-6">
          <VehicleTable
            v-if="parkingRecord.motorbikes.length > 0"
            title="Danh sách xe máy"
            vehicle-type="motorbike"
            :vehicles="parkingRecord.motorbikes"
            :parking-date="parkingRecord.date"
            color="bg-blue-500 hover:bg-blue-600"
            @detail="goToDetail"
          />
          <VehicleTable
            v-if="parkingRecord.cars.length > 0"
            title="Danh sách ô tô"
            vehicle-type="car"
            :vehicles="parkingRecord.cars"
            :parking-date="parkingRecord.date"
            color="bg-blue-500 hover:bg-blue-600"
            @detail="goToDetail"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500">
      Không có ngày nào được gửi xe.
    </div>
  </div>
</template>
