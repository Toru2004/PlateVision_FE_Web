<script setup lang="ts">
import type { VehicleInfo } from "@/@type/historyParking";

interface Props {
  title: string;
  vehicles: VehicleInfo[];
  vehicleType: string;
  color?: string;
}

interface Emits {
  (event: "detail", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const goToDetail = (licensePlate: string) => {
  const payload = `${licensePlate}_${props.vehicleType}`;
  emit("detail", payload);
};
</script>

<template>
  <table class="w-full text-sm border border-collapse table-auto">
    <thead class="bg-gray-200">
      <tr>
        <th colspan="4" class="p-2 font-bold border text-left">{{ title }}</th>
      </tr>
      <tr>
        <th class="p-2 border">Biển số xe</th>
        <th class="p-2 border">Số lần vào</th>
        <th class="p-2 border">Số lần ra</th>
        <th class="p-2 border">Chi tiết</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!vehicles || vehicles.length === 0">
        <td colspan="4" class="p-2 italic text-center text-gray-500 border">
          Không có xe nào được gửi trong ngày này
        </td>
      </tr>
      <tr
        v-else
        v-for="(vehicle, index) in vehicles"
        :key="index"
        class="text-center hover:bg-gray-100"
      >
        <td class="p-2 border">{{ vehicle.licensePlate ?? "---" }}</td>
        <td class="p-2 border">{{ vehicle.solanvao ?? "---" }}</td>
        <td class="p-2 border">{{ vehicle.solanra ?? "---" }}</td>
        <td class="p-2 border">
          <button
            class="px-2 py-1 text-white rounded"
            :class="color || 'bg-blue-500 hover:bg-blue-600'"
            @click="goToDetail(vehicle.licensePlate)"
          >
            Xem chi tiết
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
