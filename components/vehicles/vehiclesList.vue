<template>
    <div>
        <h1 class="text-2xl font-blod mb-4">Danh sách xe</h1>
        <searchBar :data="allVehicles" :fields="['biensoxe', 'ten']" @filtered="handleFiltered" />
        <div v-if="loading" class="text-gray-600">dang tai...</div>
        <table v-else class="table-auto w-full border border-gray-300">
            <thead class="bg-gray-100">
                <tr class="bg-blue-600 text-white">
                    <th class="p-2 border">Biển số chính</th>
                    <th class="p-2 border">Tên</th>
                    <th class="p-2 border">Biển số phụ</th>
                </tr>
            </thead>
            <tbody class="border-t">
                <tr v-for="(vehicle, index) in displayVehicles" :key="index">
                    <td class="p-2 border cursor-pointer bg-blue-100 hover:bg-blue-200"
                        @click="vehicle.biensoxe ? $router.push(`/vehicles/detail/${vehicle.biensoxe}`) : ''">      
                    {{ vehicle.biensoxe }}
                    </td>
                    <td class="p-2 border">{{ vehicle.ten }}</td>
                    <td class="p-2 border cursor-pointer bg-blue-100 hover:bg-blue-200" @click="vehicle.biensophu ? $router.push(`/vehicles/detail/${vehicle.biensophu.bienSo}`) : ''">
                        <span v-if="vehicle.biensophu">{{ vehicle.biensophu.bienSo }}</span>
                        <span v-else>Không có</span>
                    </td>
                </tr>
            </tbody>

        </table>
    </div>

</template>

<script setup lang="ts">
import searchBar from '../organisms/searchBar.vue';
import type { vehicles } from '@/@type/vehicles';
import {useRoute} from 'vue-router';
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
  filteredVehicles.value.filter(vehicle => vehicle.biensoxe && vehicle.biensoxe.trim() !== '')
);

onMounted(() => {
    allVehicles.value = props.vehicles;
    filteredVehicles.value = props.vehicles; // Khởi tạo filteredVehicles với tất cả dữ liệu
});
watch(() => props.vehicles, (newVehicles) => {
    allVehicles.value = newVehicles;
    filteredVehicles.value = newVehicles;
});
</script>

<style lang="scss" scoped>

</style>