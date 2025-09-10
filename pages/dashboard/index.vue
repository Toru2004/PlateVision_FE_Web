<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { collection, getFirestore, getDocs, onSnapshot } from "firebase/firestore";
import { firebaseApp } from "@/plugins/0.firebase.client";
import Infomation from "@/components/organisms/dashboard/Infomation.vue";
import { getDatabase, ref as rtdbRef, onValue, off } from "firebase/database";

const db = getFirestore(firebaseApp);
const rtdb = getDatabase(firebaseApp);

const xeHienTai = ref<number>(0); 
const xeRaVaoHomNay = ref<number>(0);
const soNguoiDangKy = ref<number>(0);
const tongYeuCau = ref<number>(0);
const tongLuotCongHoatDong = ref<number>(0);
const unsubscribeXeListeners: (() => void)[] = [];
const trangThaiCong = ref<boolean | null>(null);

const lastXeHienTai = ref<number | null>(null);
const lastXeRaVaoHomNay = ref<number | null>(null);
const lastTongYeuCau = ref<number | null>(null);

const deltaXeHienTai = ref<number>(0);
const deltaXeRaVao = ref<number>(0);
const deltaYeuCau = ref<number>(0);

let unsubscribeListeners: (() => void)[] = [];

// Hàm lấy ngày hôm nay dạng "ddMMyyyy"
function getTodayId(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}${mm}${yyyy}`;
}

// Đếm xe ra vào hôm nay (vẫn từ Firestore)
async function fetchAndUpdateXeRaVaoHomNay() {
    const lichSuRef = collection(db, "lichsuhoatdong");
    const lichSuDocs = await getDocs(lichSuRef);

    const ngayHomNay = getTodayId();
    let demRaVaoHomNay = 0;

    for (const ngayDoc of lichSuDocs.docs) {
        const ngayId = ngayDoc.id;

        // Gom chung 2 loại phương tiện
        const loaiXeList = ["xemay", "xeoto"];

        for (const loai of loaiXeList) {
            const xeRef = collection(db, "lichsuhoatdong", ngayId, loai);
            const xeDocs = await getDocs(xeRef);

            for (const xeDoc of xeDocs.docs) {
                const data = xeDoc.data();
                const vao = data.solanvao || 0;
                const ra = data.solanra || 0;

                if (ngayId === ngayHomNay && (vao > 0 || ra > 0)) {
                    demRaVaoHomNay++;
                }
            }
        }
    }

    deltaXeRaVao.value =
        lastXeRaVaoHomNay.value !== null
            ? demRaVaoHomNay - lastXeRaVaoHomNay.value
            : 0;

    lastXeRaVaoHomNay.value = demRaVaoHomNay;
    xeRaVaoHomNay.value = demRaVaoHomNay;
}

// Lắng nghe realtime số xe trong bãi từ RTDB
function listenXeHienTai() {
    const bienSoRef = rtdbRef(rtdb, "biensotrongbai");
    const unsub = onValue(bienSoRef, (snapshot) => {
        let count = 0;
        if (snapshot.exists()) {
            const data = snapshot.val();
            count = Object.keys(data).length;
        }

        deltaXeHienTai.value =
            lastXeHienTai.value !== null ? count - lastXeHienTai.value : 0;

        lastXeHienTai.value = count;
        xeHienTai.value = count;
    });

    unsubscribeListeners.push(() => off(bienSoRef));
}

function setupRealtimeListener() {
    const ngayId = getTodayId();
    const xeRef = collection(db, "lichsuhoatdong", ngayId, "xe");

    const unsub = onSnapshot(xeRef, async () => {
        await fetchAndUpdateXeRaVaoHomNay();
    });

    unsubscribeListeners.push(unsub);

    fetchAndUpdateXeRaVaoHomNay();
}

function listenSoNguoiDangKy() {
    const refDangKy = collection(db, "thongtindangky");
    const unsub = onSnapshot(refDangKy, (snapshot) => {
        const users = snapshot.docs.filter((doc) => {
            const data = doc.data();
            return data.role !== "admin";
        });
        soNguoiDangKy.value = users.length;
    });
    unsubscribeListeners.push(unsub);
}

function listenTongYeuCau() {
    const yeuCauRef = collection(db, "lichsuyeucau");
    const unsub = onSnapshot(yeuCauRef, (snapshot) => {
        tongYeuCau.value = snapshot.size;
        if (lastTongYeuCau.value !== null) {
            deltaYeuCau.value = tongYeuCau.value - lastTongYeuCau.value;
        }
        lastTongYeuCau.value = tongYeuCau.value;
    });
    unsubscribeListeners.push(unsub);
}

async function listenTongLuotCongHoatDongRealtime() {
    const lichSuRef = collection(db, "lichsuhoatdong");

    const unsubLichSu = onSnapshot(lichSuRef, (ngaySnapshot) => {
        unsubscribeXeListeners.forEach((unsub) => unsub());
        unsubscribeXeListeners.length = 0;

        ngaySnapshot.docs.forEach((ngayDoc) => {
            const ngayId = ngayDoc.id;
            const xeRef = collection(db, "lichsuhoatdong", ngayId, "xe");

            const unsubXe = onSnapshot(xeRef, () => {
                recomputeTongLuotCongHoatDong();
            });

            unsubscribeXeListeners.push(unsubXe);
        });
    });

    unsubscribeListeners.push(unsubLichSu);
}

async function recomputeTongLuotCongHoatDong() {
    const lichSuRef = collection(db, "lichsuhoatdong");
    const lichSuDocs = await getDocs(lichSuRef);

    let total = 0;

    for (const ngayDoc of lichSuDocs.docs) {
        const ngayId = ngayDoc.id;
        const xeRef = collection(db, "lichsuhoatdong", ngayId, "xe");
        const xeDocs = await getDocs(xeRef);

        for (const xeDoc of xeDocs.docs) {
            const data = xeDoc.data();
            const vao = data.solanvao || 0;
            const ra = data.solanra || 0;
            total += vao + ra;
        }
    }

    tongLuotCongHoatDong.value = total;
}

function listenTrangThaiCong() {
    const congRef = rtdbRef(rtdb, "trangthaicong");

    const unsub = onValue(congRef, (snapshot) => {
        trangThaiCong.value = snapshot.val();
    });

    unsubscribeListeners.push(() => off(congRef));
}

onMounted(() => {
    listenXeHienTai();          // cập nhật từ biensotrongbai (RTDB)
    setupRealtimeListener();    // cập nhật ra/vào hôm nay (Firestore)
    listenSoNguoiDangKy();
    listenTongYeuCau();
    listenTongLuotCongHoatDongRealtime();
    listenTrangThaiCong();
});

onUnmounted(() => {
    unsubscribeListeners.forEach((unsub) => unsub());
    unsubscribeXeListeners.forEach((unsub) => unsub());
});

definePageMeta({
    layout: "default",
});
</script>

<template>
    <Infomation
        :xeHienTai="xeHienTai"
        :deltaXeHienTai="deltaXeHienTai"
        :xeRaVaoHomNay="xeRaVaoHomNay"
        :deltaXeRaVao="deltaXeRaVao"
        :soNguoiDangKy="soNguoiDangKy"
        :tongYeuCau="tongYeuCau"
        :deltaYeuCau="deltaYeuCau"
        :tongLuotCongHoatDong="tongLuotCongHoatDong"
        :trangThaiCong="trangThaiCong"
    />
</template>
