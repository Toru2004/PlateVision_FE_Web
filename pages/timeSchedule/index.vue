<template>
    <ScheduleOptions
        :isLoading="isLoading"
        :giaHan="giaHan"
        :selectedOption="selectedOption"
        :gioiHanGio="gioiHanGio"
        :gioiHanNgay="gioiHanNgay"
        @update:giaHan="(v) => (giaHan = v)"
        @update:selectedOption="(v) => (selectedOption = v)"
        @update:save="saveChanges"
    />
</template>

<script setup lang="ts">
import { doc, getDoc, updateDoc, Timestamp, type Firestore } from "firebase/firestore";
import ScheduleOptions from "@/components/organisms/timeSchedule/ScheduleOptions.vue";
import { toast } from "vue3-toastify";

const { $firestore } = useNuxtApp();
const db = $firestore as Firestore;

const giaHan = ref(false);
const selectedOption = ref<"gio" | "ngay">("gio");
const isLoading = ref(true);

const getMidnightToday = (): Timestamp => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // 12:00 AM hôm nay
    return Timestamp.fromDate(now);
};
const gioiHanGio = ref<number>(24);
const gioiHanNgay = ref<Timestamp>(getMidnightToday());

// Lấy dữ liệu từ Firestore
const fetchRule = async () => {
    try {
        isLoading.value = true;
        const docRef = doc(db, "quydinh", "PnKy43d1MPcSHiotg8Cz");
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        giaHan.value = data?.giahan ?? false;

        if (data?.gioihangio != null) {
            selectedOption.value = "gio";
        } else if (data?.gioihanngay) {
            selectedOption.value = "ngay";
        }

        gioiHanGio.value = data?.gioihangio ?? 24;
        gioiHanNgay.value = data?.gioihanngay ?? getMidnightToday();
    } catch (err) {
        console.error("Lỗi khi fetch quy định:", err);
    } finally {
        isLoading.value = false;
    }
};

// Gửi dữ liệu lên Firestore
const saveChanges = async () => {
    try {
        const docRef = doc(db, "quydinh", "PnKy43d1MPcSHiotg8Cz");

        const dataToUpdate: any = {
            giahan: giaHan.value,
        };

        if (giaHan.value) {
            if (selectedOption.value === "gio") {
                dataToUpdate.gioihangio = gioiHanGio.value;
                dataToUpdate.gioihanngay = null;
            } else {
                dataToUpdate.gioihangio = null;
                dataToUpdate.gioihanngay = gioiHanNgay.value;
            }
        } else {
            dataToUpdate.gioihangio = null;
            dataToUpdate.gioihanngay = null;
        }

        console.log("Dữ liệu gửi:", dataToUpdate);
        await updateDoc(docRef, dataToUpdate);
        toast.success("Đã lưu thành công");
    } catch (err) {
        console.error("Lỗi khi lưu:", err);
    }
};

onMounted(fetchRule);
</script>
