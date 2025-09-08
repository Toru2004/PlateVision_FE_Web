<script setup lang="ts">
import type { VehicleInfo } from "@/@type/historyParking";

interface Props {
  title: string;
  vehicles: VehicleInfo[];
  vehicleType: string;
  parkingDate: string;
  color?: string;
}

interface Emits {
  (event: "detail", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const goToDetail = (licensePlate: string) => {
  const payload = `${licensePlate}_${props.vehicleType}_${props.parkingDate}`;
  emit("detail", payload);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4">
    <!-- Tiêu đề bảng -->
    <h3 class="mb-4 text-lg font-semibold text-gray-700">
      {{ title }}
    </h3>

    <!-- Bảng -->
    <div class="overflow-x-auto rounded-lg border">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th class="px-4 py-2 border">Biển số xe</th>
            <th class="px-4 py-2 border">Số lần vào</th>
            <th class="px-4 py-2 border">Số lần ra</th>
            <th class="px-4 py-2 border">Chi tiết</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-if="!vehicles || vehicles.length === 0">
            <td colspan="4" class="px-4 py-3 italic text-center text-gray-500">
              Không có xe nào được gửi trong ngày này
            </td>
          </tr>

          <tr
            v-else
            v-for="(vehicle, index) in vehicles"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border font-medium text-gray-700">
              {{ vehicle.licensePlate ?? "---" }}
            </td>
            <td class="px-4 py-2 border">
              {{ vehicle.solanvao ?? "---" }}
            </td>
            <td class="px-4 py-2 border">
              {{ vehicle.solanra ?? "---" }}
            </td>
            <td class="px-4 py-2 border">
              <button
                class="px-3 py-1 text-xs font-medium text-white rounded-lg transition"
                :class="color || 'bg-blue-500 hover:bg-blue-600'"
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
</template>
