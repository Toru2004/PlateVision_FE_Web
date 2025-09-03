<script setup lang="ts">
import type { ParkingRecord, TimeLine, VehicleInfo } from "@/@type/historyParking";
import ParkingHistoryItem from "@/components/organisms/historyParking/ParkingHistoryItem.vue";
import { collection, getDocs, type Firestore } from "firebase/firestore";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const { $firestore } = useNuxtApp();
const db = $firestore as Firestore;

const listParkingHistory = ref<ParkingRecord[]>([]);

const loading = ref(false);

const fetchParkingHistory = async (): Promise<void> => {
    try {
        const historyRef = collection(db, "lichsuhoatdong");
        const historySnapshot = await getDocs(historyRef);

        for (const historyDoc of historySnapshot.docs) {
            const date = historyDoc.id;

            try {
                const xeRef = collection(db, "lichsuhoatdong", date, "xe");
                const xeSnapshot = await getDocs(xeRef);

                const vehicles: VehicleInfo[] = [];

                for (const xeDoc of xeSnapshot.docs) {
                    const licensePlate = xeDoc.id;
                    const solanvao = xeDoc.data().solanvao || 0;
                    const solanra = xeDoc.data().solanra || 0;

                    try {
                        const timelineRef = collection(db, "lichsuhoatdong", date, "xe", licensePlate, "timeline");
                        const timelineSnapshot = await getDocs(timelineRef);

                        const timeline: TimeLine[] = timelineSnapshot.docs.map((t) => {
                            const data = t.data();
                            return {
                                timeOut: data.timeOut || "",
                                timeIn: data.timeIn || "",
                                imageOut: data.imageOut || "",
                                imageIn: data.imageIn || "",
                                hinhdauxera: data.hinhdauxera || "",
                                hinhdauxevao: data.hinhdauxevao || "",
                            };
                        });

                        vehicles.push({
                            licensePlate,
                            solanvao,
                            solanra,
                            timeline,
                        });
                    } catch (timelineError) {
                        console.error(`Lỗi khi lấy timeline của xe ${licensePlate} ngày ${date}:`, timelineError);
                    }
                }

                // if (vehicles.length > 0) {
                listParkingHistory.value.push({
                    date,
                    vehicles,
                });
                // }
            } catch (xeError) {
                console.error(`Lỗi khi lấy danh sách xe cho ngày ${date}:`, xeError);
            }
        }
    } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
    }

    console.log("Dữ liệu đầy đủ:", listParkingHistory);
};

const goTo = (path: string) => {
    if (route.path !== path) {
        router.push(path);
    }
};
const handleDetail = (licensePlate: string) => {
    const path = `/manageVehicles/detail/${licensePlate}`;
    if (route.path !== path) {
        router.push(path);
    }
};
onMounted(fetchParkingHistory);
</script>

<template>
    <ParkingHistoryItem :listParkingHistory="listParkingHistory" @detailHistoryParking="handleDetail" />
</template>
