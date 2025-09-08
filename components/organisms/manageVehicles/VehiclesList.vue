<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
      <!-- Title -->
      <h1 class="text-2xl font-bold text-gray-800">Danh sách xe</h1>

      <!-- Search -->
      <SearchBar
        class="w-full md:w-80"
        :data="props.vehicles"
        :fields="['biensoxe', 'ten']"
        placeholder="Tìm biển số, tên xe..."
        @filtered="handleFiltered"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 italic">Đang tải dữ liệu...</div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-lg shadow-md">
      <table class="w-full border-collapse bg-white">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">Biển số chính</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Tên</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Biển số phụ</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(vehicle, index) in displayVehicles"
            :key="index"
            class="hover:bg-blue-50 transition-colors even:bg-gray-50"
          >
            <!-- Biển số chính -->
            <td
              class="px-4 py-2 font-medium text-blue-700 cursor-pointer"
              @click="vehicle.biensoxe ? $router.push(`/manageVehicles/detail/${vehicle.biensoxe}`) : ''"
            >
              {{ vehicle.biensoxe }}
            </td>

            <!-- Tên xe -->
            <td class="px-4 py-2 text-gray-700">
              {{ vehicle.ten }}
            </td>

            <!-- Biển số phụ -->
            <td
              class="px-4 py-2 cursor-pointer"
              :class="vehicle.biensophu ? 'text-blue-600 font-medium hover:underline' : 'text-gray-400 italic'"
              @click="vehicle.biensophu ? $router.push(`/vehicles/detail/${vehicle.biensophu.bienSo}`) : ''"
            >
              <span v-if="vehicle.biensophu">{{ vehicle.biensophu.bienSo }}</span>
              <span v-else>Không có</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "@/components/organisms/SearchBar.vue";
import type { vehicles } from "@/@type/vehicles";
import { useRoute } from "vue-router";

const allVehicles = ref<vehicles[]>([]);
const filteredVehicles = ref<vehicles[]>([]);
const route = useRoute();

function handleFiltered(filtered: vehicles[]) {
  filteredVehicles.value = filtered;
}

interface Props {
  vehicles: Array<vehicles>;
  loading: boolean;
}
const props = defineProps<Props>();

const displayVehicles = computed(() =>
  filteredVehicles.value.filter(
    (vehicle) => vehicle.biensoxe && vehicle.biensoxe.trim() !== ""
  )
);

onMounted(() => {
  allVehicles.value = props.vehicles;
  filteredVehicles.value = props.vehicles;
});
watch(
  () => props.vehicles,
  (newVehicles) => {
    allVehicles.value = newVehicles;
    filteredVehicles.value = newVehicles;
  }
);
</script>
