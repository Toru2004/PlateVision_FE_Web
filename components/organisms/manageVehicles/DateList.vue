<template>
    <div></div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { getFirestore, getDocs, collection, Firestore } from "firebase/firestore";
export function useDateList(db: Firestore) {
    const dates = ref<string[]>([]);
    const loading = ref(true);

    const fetchDatas = async () => {
        const dateSnapshot = await getDocs(collection(db, "lichsuhoatdong"));
        dates.value = dateSnapshot.docs.map((doc) => doc.id);
        loading.value = false;
    };

    onMounted(() => {
        fetchDatas();
    });
    return {
        dates,
        loading,
    };
}
</script>

<style lang="scss" scoped></style>
