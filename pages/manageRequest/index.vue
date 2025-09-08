<template>
    <div>
        <RequestList :requests="requests" :loading="loading" />
        <div class="text-center mt-4">
            <button v-if="hasNext && !loading" @click="fetchPage"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-900">Tải thêm</button>
            <div v-else-if="loading" class="text-gray-600">dang tai...</div>
            <div v-else class="text-gray-600 italic">het du lieu</div>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { RequestInfor } from '@/@type/Request';
import { getStatus, listenStatus } from '@/stores/creatRequest';
import { paginateFirestore } from '@/utils/paginateFirestore';

const { $firestore } = useNuxtApp();

const requests = ref<RequestInfor[]>([]);
const loading = ref(false);
const lastDoc = ref<any>(null);
const hasNext = ref(true);
const fetchPage = async () => {
    loading.value = true;
    try {
        const { data, lastDoc: newLastDoc, hasNext: more } = await paginateFirestore<RequestInfor>({
            collectionPath: 'lichsuyeucau',
            orderByField: 'approve',
            limitCount: 10,
            lastVisible: lastDoc.value,
            firestoreInstance: $firestore,
        });

        if (data.length > 0) {
            requests.value.push(...data);
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
    getStatus();
    listenStatus();
});
</script>

<style lang="scss" scoped></style>