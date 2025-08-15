<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { collection, addDoc, type Firestore } from "firebase/firestore";
import { paginateFirestore } from "@/utils/paginateFirestore";
import { searchByKeyword } from "@/utils/search";
import PlateList from "@/components/organisms/rareVehicles/PlateList.vue";

interface XeInfo {
    id: string;
    bienso: string;
    image: string | null;
    timeIn: any;
    timeOut: any;
    uutien: boolean;
}

const { $firestore } = useNuxtApp();
const db = $firestore as Firestore;

// State
const danhSachXe = ref<XeInfo[]>([]);
const isLoading = ref(false);
const isAdding = ref(false);

// Form thêm mới
const newBienso = ref("");
const newUutien = ref(false);

// Modal xác nhận
const showConfirmModal = ref(false);

// Tìm kiếm
const searchKeyword = ref("");

// Pagination
const lastDoc = ref<any>(null);
const hasNext = ref(true);
const limitCount = 6;

// Lấy dữ liệu (có phân trang)
const fetchPage = async (isNext = false) => {
    if (isNext && !hasNext.value) return;
    isLoading.value = true;
    try {
        const { data, lastDoc: last, hasNext: next } =
            await paginateFirestore<XeInfo>({
                collectionPath: "thongtinkhach",
                orderByField: "timeIn",
                limitCount,
                lastVisible: isNext ? lastDoc.value : undefined,
                firestoreInstance: db,
            });

        if (isNext) {
            danhSachXe.value = [...danhSachXe.value, ...data];
        } else {
            danhSachXe.value = data;
        }

        lastDoc.value = last;
        hasNext.value = next;
    } catch (err) {
        console.error("Lỗi khi phân trang:", err);
    }
    isLoading.value = false;
};
// Hàm mở modal xác nhận trước khi thêm
const addXe = () => {
    if (!newBienso.value.trim()) {
        alert("Vui lòng nhập biển số");
        return;
    }
    showConfirmModal.value = true;
};

// Hàm xác nhận thêm xe
const confirmAddXe = async () => {
    if (!newBienso.value.trim()) {
        alert("Vui lòng nhập biển số");
        return;
    }
    isAdding.value = true;
    try {
        await addDoc(collection(db, "thongtinkhach"), {
            bienso: newBienso.value.trim(),
            image: null,
            timeIn: null,
            timeOut: null,
            uutien: newUutien.value,
        });
        newBienso.value = "";
        newUutien.value = false;
        await fetchPage(false);
        showConfirmModal.value = false;
    } catch (err) {
        console.error("Lỗi khi thêm xe:", err);
    }
    isAdding.value = false;
};

// Lọc dữ liệu
const filteredDanhSachXe = computed(() =>
    searchByKeyword(danhSachXe.value, searchKeyword.value, ["bienso"])
);

onMounted(() => fetchPage(false));
</script>

<template>
    <PlateList :danh-sach-xe="filteredDanhSachXe" :is-loading="isLoading" :is-adding="isAdding" :new-bienso="newBienso"
        :new-uutien="newUutien" :search-keyword="searchKeyword" :has-next="hasNext"
        :show-confirm-modal="showConfirmModal" @update:new-bienso="newBienso = $event"
        @update:new-uutien="newUutien = $event" @update:search-keyword="searchKeyword = $event"
        @update:show-confirm-modal="showConfirmModal = $event" @add-xe="confirmAddXe" @fetch-page="fetchPage" />
</template>
