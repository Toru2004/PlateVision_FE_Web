<template>
  <div>
    <!-- Header + Actions -->
<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
  <!-- Title -->
  <h1 class="text-2xl font-bold text-gray-800">Danh sách đăng ký</h1>

  <!-- Actions -->
  <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
    <button
      @click="handleOpenAddUserModal"
      class="h-10 px-4 flex items-center text-sm font-medium text-white bg-green-600 rounded-lg shadow hover:bg-green-700 transition"
    >
      + Người dùng
    </button>
    <button
      @click="handleOpenAddAdminSecurityModal"
      class="h-10 px-4 flex items-center text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
    >
      + Bảo vệ
    </button>

    <!-- Search tái sử dụng -->
    <SearchBar
      class="h-10 w-full sm:w-64"
      :data="props.users"
      :fields="['ten', 'email', 'cccd', 'role']"
      placeholder="Tìm tên, email, CCCD, role..."
      @filtered="handleFiltered"
    />
  </div>
</div>


    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 italic text-center py-6">
      Đang tải dữ liệu...
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-blue-600 text-white text-sm uppercase tracking-wide">
            <th class="px-4 py-3 text-left">Tên</th>
            <th class="px-4 py-3 text-left">CCCD</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="index"
            class="hover:bg-blue-50 transition-colors even:bg-gray-50">
            <td class="px-4 py-2 font-medium text-gray-800">{{ user.ten }}</td>
            <td class="px-4 py-2 text-gray-700">{{ user.cccd }}</td>
            <td class="px-4 py-2 text-gray-700">{{ user.email }}</td>
            <td class="px-4 py-2">
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                user.role === 'admin'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-green-100 text-green-600'
              ]">
                {{
                  user.role === 'admin'
                    ? 'Bảo vệ'
                    : user.role === 'user'
                      ? 'Người dùng'
                      : user.role
                }}
              </span>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500 italic">
              Không có dữ liệu phù hợp
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "@/components/organisms/SearchBar.vue";

interface Props {
  users: Array<UserRegister>;
  loading: boolean;
}

interface Emits {
  (event: "delete", selectedId: string): void;
  (event: "open-add-user-modal"): void;
  (event: "open-add-admin-security-modal"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filteredUsers = ref<UserRegister[]>([]);

const handleFiltered = (filtered: UserRegister[]) => {
  filteredUsers.value = filtered;
};

const handleOpenAddUserModal = () => emit("open-add-user-modal");
const handleOpenAddAdminSecurityModal = () => emit("open-add-admin-security-modal");

// init
onMounted(() => {
  filteredUsers.value = props.users;
});
watch(
  () => props.users,
  (newVal) => {
    filteredUsers.value = newVal;
  }
);
</script>
