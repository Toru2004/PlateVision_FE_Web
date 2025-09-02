<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";

// Chart.js + vue-chartjs
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line as LineChart, Bar as BarChart, Pie as PieChart } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale
);

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
};
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const payments = ref<any[]>([]);

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "lichsumualuot"));
  payments.value = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate()
        : new Date(data.createdAt),
    };
  });
});

// Utils
const formatCurrency = (val: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val || 0);

// ================== FILTER OPTIONS ==================
const selectedView = ref<"week" | "month" | "year">("week");

// tuần -> chọn tháng + năm
const selectedWeekMonth = ref(new Date().getMonth() + 1);
const selectedWeekYear = ref(new Date().getFullYear());

// tháng -> chọn năm
const selectedMonthYear = ref(new Date().getFullYear());

// năm -> chọn khoảng năm
const selectedYearStart = ref(new Date().getFullYear() - 5);
const selectedYearEnd = ref(new Date().getFullYear());

// danh sách năm từ dữ liệu
const availableYears = computed(() => {
  const years = payments.value.map((p) => p.createdAt.getFullYear());
  return Array.from(new Set(years)).sort((a, b) => a - b);
});

// ================== XỬ LÝ DỮ LIỆU ==================
const weeklyData = computed(() => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const data = days.map((d) => ({ day: d, tongtien: 0 }));

  payments.value.forEach((p) => {
    const date = p.createdAt;
    if (
      date.getFullYear() === selectedWeekYear.value &&
      date.getMonth() + 1 === selectedWeekMonth.value
    ) {
      const idx = date.getDay();
      data[idx].tongtien += p.tongtien || 0;
    }
  });
  return data;
});

const monthlyData = computed(() => {
  const data = Array.from({ length: 12 }, (_, i) => ({
    month: `T${i + 1}`,
    tongtien: 0,
  }));

  payments.value.forEach((p) => {
    const date = p.createdAt;
    if (date.getFullYear() === selectedMonthYear.value) {
      const m = date.getMonth();
      data[m].tongtien += p.tongtien || 0;
    }
  });

  return data;
});

const yearlyData = computed(() => {
  const map: Record<string, number> = {};
  payments.value.forEach((p) => {
    const date = p.createdAt;
    const y = date.getFullYear();
    if (y >= selectedYearStart.value && y <= selectedYearEnd.value) {
      map[y] = (map[y] || 0) + (p.tongtien || 0);
    }
  });

  return Object.keys(map)
    .sort()
    .map((y) => ({
      year: y,
      tongtien: map[y],
    }));
});

// ================== TỔNG ==================
const totalWeek = computed(() =>
  weeklyData.value.reduce((a, b) => a + b.tongtien, 0)
);
const totalMonth = computed(() =>
  monthlyData.value.reduce((a, b) => a + b.tongtien, 0)
);
const totalYear = computed(() =>
  yearlyData.value.reduce((a, b) => a + b.tongtien, 0)
);

// ================== DỮ LIỆU BIỂU ĐỒ ==================
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const weeklyChartData = computed(() => ({
  labels: weeklyData.value.map((d) => d.day),
  datasets: [
    {
      label: "Doanh thu tuần",
      data: weeklyData.value.map((d) => d.tongtien),
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6",
    },
  ],
}));

const monthlyChartData = computed(() => ({
  labels: monthlyData.value.map((d) => d.month),
  datasets: [
    {
      label: "Doanh thu tháng",
      data: monthlyData.value.map((d) => d.tongtien),
      backgroundColor: "#10b981",
    },
  ],
}));

const yearlyChartData = computed(() => ({
  labels: yearlyData.value.map((d) => d.year),
  datasets: [
    {
      label: "Doanh thu năm",
      data: yearlyData.value.map((d) => d.tongtien),
      backgroundColor: ["#8b5cf6", "#f59e0b", "#ef4444", "#3b82f6"],
    },
  ],
}));

const currentTotal = computed(() => {
  if (selectedView.value === "week") return totalWeek.value;
  if (selectedView.value === "month") return totalMonth.value;
  return totalYear.value;
});

const currentChartData = computed(() => {
  if (selectedView.value === "week") return weeklyChartData.value;
  if (selectedView.value === "month") return monthlyChartData.value;
  return yearlyChartData.value;
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-3xl font-bold mb-8">Quản lý doanh thu</h1>

    <!-- Chọn chế độ -->
    <div class="mb-6">
      <label class="block text-gray-600 mb-2 font-medium">Chọn chế độ hiển thị:</label>
      <select v-model="selectedView" class="border rounded-lg p-2">
        <option value="week">Theo tuần</option>
        <option value="month">Theo tháng</option>
        <option value="year">Theo năm</option>
      </select>
    </div>

    <!-- Filter bổ sung -->
    <div v-if="selectedView === 'week'" class="mb-6 flex gap-4">
      <div>
        <label class="block text-gray-600 mb-2 font-medium">Chọn tháng:</label>
        <select v-model="selectedWeekMonth" class="border rounded-lg p-2">
          <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
        </select>
      </div>
      <div>
        <label class="block text-gray-600 mb-2 font-medium">Chọn năm:</label>
        <select v-model="selectedWeekYear" class="border rounded-lg p-2">
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <div v-if="selectedView === 'month'" class="mb-6">
      <label class="block text-gray-600 mb-2 font-medium">Chọn năm:</label>
      <select v-model="selectedMonthYear" class="border rounded-lg p-2">
        <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <div v-if="selectedView === 'year'" class="mb-6 flex gap-4">
      <div>
        <label class="block text-gray-600 mb-2 font-medium">Từ năm:</label>
        <select v-model="selectedYearStart" class="border rounded-lg p-2">
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div>
        <label class="block text-gray-600 mb-2 font-medium">Đến năm:</label>
        <select v-model="selectedYearEnd" class="border rounded-lg p-2">
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <!-- Card tổng quan -->
    <div class="bg-white rounded-2xl shadow p-6 mb-8">
      <p class="text-gray-500">
        Tổng doanh thu
        <span v-if="selectedView==='week'">tuần</span>
        <span v-else-if="selectedView==='month'">tháng</span>
        <span v-else>năm</span>
      </p>
      <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(currentTotal) }}</p>
    </div>

    <!-- Biểu đồ -->
    <div class="bg-white p-4 rounded-2xl shadow">
      <h2 class="text-lg font-semibold mb-2">
        Biểu đồ doanh thu
        <span v-if="selectedView==='week'">tuần</span>
        <span v-else-if="selectedView==='month'">tháng</span>
        <span v-else>năm</span>
      </h2>
      <div class="h-64">
        <LineChart v-if="selectedView==='week'" :data="currentChartData" :options="defaultOptions" />
        <BarChart v-else-if="selectedView==='month'" :data="currentChartData" :options="defaultOptions" />
        <PieChart v-else :data="currentChartData" :options="defaultOptions" />
      </div>
    </div>
  </div>
</template>
