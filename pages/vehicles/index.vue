<template>
    <div>
    <VehiclesList :vehicles="vehicles" :loading="loading" />
    <div>
        <button v-if="hasNext && !loading"
        @click="fetchPage" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-900">More</button>
        <div v-else-if="loading" class="text-gray-600">dang tai...</div>
        <div v-else class="text-gray-600 italic">het du lieu</div>
    </div>
    </div>
</template>

<script setup lang="ts">
    import type { vehicles } from '@/@type/vehicles';
    import { paginateFirestore } from '@/utils/paginateFirestore';
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
            if (!more || data.length == 0) {
                hasNext.value = false;
            }

        } catch (err) {
            console.error('Lỗi phan trang', err);
        } finally {
            loading.value = false;
        }
    };
    onMounted(() => {
        fetchPage();
    });
</script>

<style lang="scss" scoped>

</style> 