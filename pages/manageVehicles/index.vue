<template>
  <div>
    <!-- Danh sách xe -->
    <VehiclesList :vehicles="vehicles" :loading="loading" />

    <!-- Pagination -->
    <div class="flex justify-center mt-6">
      <button
        v-if="hasNext"
        @click="fetchPage"
        :disabled="loading"
        class="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-md 
               hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed 
               flex items-center gap-2 transition"
      >
        <span v-if="!loading">Tải thêm</span>
        <span v-else>
          <svg
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </span>
      </button>

      <!-- Hết dữ liệu -->
      <p v-else class="text-gray-500 italic text-sm">Đã tải hết dữ liệu</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { vehicles } from '@/@type/vehicles';
import { paginateFirestore } from '@/utils/paginateFirestore';
import VehiclesList from "@/components/organisms/manageVehicles/VehiclesList.vue";

const { $firestore } = useNuxtApp();
const vehicles = ref<vehicles[]>([]);
const loading = ref(false);
const lastDoc = ref<any>(null);
const hasNext = ref(true);

const fetchPage = async () => {
  loading.value = true;
  try {
    const { data, lastDoc: newLastDoc, hasNext: more } = await paginateFirestore<vehicles>({
      collectionPath: 'thongtindangky',
      orderByField: 'biensoxe',
      limitCount: 10,
      lastVisible: lastDoc.value,
      firestoreInstance: $firestore,
    });

    if (data.length > 0) {
      vehicles.value.push(...data);
      lastDoc.value = newLastDoc;
    }

    if (!more || data.length === 0) {
      hasNext.value = false;
    }
  } catch (err) {
    console.error('Lỗi phân trang', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPage();
});
</script>
