<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import {
  LayoutDashboard,
  Users,
  Car,
  Bus,
  Shield,
  History,
  Clock,
  ClipboardList,
  DollarSign,
  MapPin
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Quản lý người dùng", path: "/manageUsers", icon: Users },
  { label: "Quản lý xe", path: "/manageVehicles", icon: Car },
  { label: "Quản lý xe khách", path: "/managePassengerVehicles", icon: Bus },
  { label: "Quản lý xe ưu tiên", path: "/managePriorityVehicle", icon: Shield },
  { label: "Hoạt động bãi đỗ", path: "/historyParking", icon: History },
  { label: "Gia hạn bãi đỗ", path: "/timeSchedule", icon: Clock },
  { label: "Quản lý yêu cầu", path: "/manageRequest", icon: ClipboardList },
  { label: "Quản lý doanh thu", path: "/manageRevenue", icon: DollarSign },
  { label: "Quản lý bãi đỗ", path: "/manageParking", icon: MapPin },
];

const isActive = (path: string) => route.path.startsWith(path);

const goTo = (path: string) => {
  if (route.path !== path) {
    router.push(path);
  }
};
</script>

<template>
  <aside class="h-full flex flex-col bg-[#0F172A] text-white shadow-xl">
    <!-- Logo -->
    <div class="h-16 flex items-center justify-center border-b border-blue-800">
      <span class="text-2xl font-bold text-blue-400">PlateVision</span>
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-2">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.path">
          <button
            @click="goTo(item.path)"
            class="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200"
            :class="isActive(item.path)
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-blue-800 hover:text-white hover:translate-x-1'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-blue-800 text-xs text-gray-400">
      © 2025 PlateVision
    </div>
  </aside>
</template>
