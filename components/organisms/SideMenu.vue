<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Quản lý người dùng", path: "/users" },
    { label: "Quản lý xe", path: "/vehicles" },
    { label: "Quản lý hoạt động bãi đỗ", path: "/historyParking" },
    { label: "Quản lý gia hạn bãi đỗ xe", path: "/timeSchedule" },
    { label: "Quản lý yêu cầu", path: "/managerRequest" },
    { label: "Var bãi đỗ", path: "/parkingStatus" },
    { label: "Xe đặc biệt/ưu tiên", path: "/rareVehicles" },
];

const isActive = (path: string) => route.path.startsWith(path);

const goTo = (path: string) => {
    if (route.path !== path) {
        router.push(path);
    }
};
</script>

<template>
    <aside class="hidden md:flex flex-col w-64 bg-[#1E293B] text-white shadow-lg">
        <div class="h-16 flex items-center justify-center border-b border-blue-800 bg-[#0F172A]">
            <span class="text-xl font-bold text-blue-400">PlateVision</span>
        </div>
        <nav class="flex-1 px-2 py-4 space-y-2 overflow-auto">
            <ul class="space-y-1">
                <li v-for="item in menuItems" :key="item.path">
                    <button @click="goTo(item.path)"
                        class="w-full px-4 py-2 font-medium text-left transition-all duration-200 rounded-lg" :class="isActive(item.path)
                                ? 'bg-blue-600 text-white shadow-inner'
                                : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                            ">
                        {{ item.label }}
                    </button>
                </li>
            </ul>
        </nav>
    </aside>
</template>
