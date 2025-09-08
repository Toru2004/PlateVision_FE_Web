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

const fetchVehiclesByType = async (date: string, type: string): Promise<VehicleInfo[]> => {
  const xeRef = collection(db, "lichsuhoatdong", date, type);
  const xeSnapshot = await getDocs(xeRef);

  const vehicles: VehicleInfo[] = [];

  for (const xeDoc of xeSnapshot.docs) {
    const licensePlate = xeDoc.id;
    const solanvao = xeDoc.data().solanvao || 0;
    const solanra = xeDoc.data().solanra || 0;

    try {
      const timelineRef = collection(db, "lichsuhoatdong", date, type, licensePlate, "timeline");
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
        vehicleType: type,
      });
    } catch (timelineError) {
      console.error(`Lỗi khi lấy timeline của ${type} ${licensePlate} ngày ${date}:`, timelineError);
    }
  }

  return vehicles;
};

const fetchParkingHistory = async (): Promise<void> => {
  try {
    const historyRef = collection(db, "lichsuhoatdong");
    const historySnapshot = await getDocs(historyRef);

    for (const historyDoc of historySnapshot.docs) {
      const date = historyDoc.id;

      try {
        const [motorbikes, cars] = await Promise.all([
          fetchVehiclesByType(date, "xemay"),
          fetchVehiclesByType(date, "xeoto"),
        ]);
        if (motorbikes.length > 0 || cars.length > 0) {
            listParkingHistory.value.push({
              date,
              motorbikes,
              cars,
            });
        }
      } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu xe cho ngày ${date}:`, error);
      }
    }
  } catch (err) {
    console.error("Lỗi lấy dữ liệu:", err);
  }

  console.log("Dữ liệu đầy đủ:", listParkingHistory.value);
};

const goTo = (path: string) => {
    if (route.path !== path) {
        router.push(path);
    }
};
const handleDetail = (licensePlate: string) => {
    const path = `/historyParking/detail/${licensePlate}`;
    if (route.path !== path) {
        router.push(path);
    }
};
onMounted(fetchParkingHistory);
</script>

<template>
    <ParkingHistoryItem :listParkingHistory="listParkingHistory" @detailHistoryParking="handleDetail" />
</template>
