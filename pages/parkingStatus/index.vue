<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getDatabase, ref as dbRef, onValue, set } from 'firebase/database';
import PlateList from '@/components/organisms/parkingStatus/PlateList.vue';
import { searchByKeyword } from '@/utils/search'; // <-- đường dẫn có thể điều chỉnh

const database = getDatabase();

const allCars = ref<{ plate: string; canhbao?: boolean; timeExpired?: string; timestamp?: string; trangthai?: boolean }[]>([]);
const gateStatus = ref<boolean | null>(null);
const timeEnd = ref<string | null>(null);

const searchTerm = ref('');
const filteredCars = computed(() =>
    searchByKeyword(allCars.value, searchTerm.value, ['plate'])
);

const currentPage = ref(1);
const pageSize = 4;

const totalPages = computed(() =>
    Math.ceil(filteredCars.value.length / pageSize)
);

const currentPageItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredCars.value.slice(start, start + pageSize);
});

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

const fetchRealtimeData = () => {
    const bsbRef = dbRef(database, 'biensotrongbai');
    onValue(bsbRef, (snapshot) => {
        const data = snapshot.val();
        const cars: any[] = [];

        for (const key in data) {
            const carData = data[key];
            if (typeof carData === 'object' && carData !== null) {
                cars.push({
                    plate: key,
                    canhbao: carData?.canhbao ?? null,
                    timeExpired: carData?.timeExpired ?? null,
                    timestamp: carData?.timestamp ?? null,
                    trangthai: carData?.trangthai ?? null,
                });
            }
        }

        allCars.value = cars;
        currentPage.value = 1;
    });

    const gateRef = dbRef(database, 'trangthaicong');
    onValue(gateRef, (snapshot) => {
        gateStatus.value = snapshot.val();
    });
    const timeEndRef = dbRef(database, 'TimeEnd');
    onValue(timeEndRef, (snapshot) => {
        timeEnd.value = snapshot.val();
    });
};

const saveTime = async (value: string) => {
  const timeEndRef = dbRef(database, "TimeEnd");
  await set(timeEndRef, value);
};

onMounted(fetchRealtimeData);
</script>

<template>
    <PlateList
    :cars="currentPageItems"
    :gateStatus="gateStatus"
    :timeEnd="timeEnd"
    :currentPage="currentPage"
    :totalPages="totalPages"
    :onNext="nextPage"
    :onPrev="prevPage"
    :searchTerm="searchTerm"
    @update:searchTerm="(val) => searchTerm = val"
    @saveTimeEnd="saveTime"
  />
</template>
