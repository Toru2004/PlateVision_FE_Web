<script setup lang="ts">
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

const searchQuery = ref(""); // 👈 đây là v-model
const handleClickDeleteItem = (id: string) => {
    emit("delete", id);
};

const filteredUsers = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return props.users.filter(
        (user) =>
            user.ten.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.cccd.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query)
    );
});

const handleOpenAddUserModal = () => {
    emit("open-add-user-modal");
};

const handleOpenAddAdminSecurityModal = () => {
    emit("open-add-admin-security-modal");
};
</script>

<template>
    <div>
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold">Danh sách đăng ký</h1>

            <div class="flex items-center space-x-2">
                <button @click="handleOpenAddUserModal" class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                    Thêm người dùng
                </button>
                <button
                    @click="handleOpenAddAdminSecurityModal"
                    class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                    Thêm bảo vệ
                </button>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Tìm theo biển số, email, CCCD"
                    class="w-64 px-3 py-2 border rounded"
                />
            </div>
        </div>

        <div v-if="loading">Đang tải...</div>
        <table v-else class="w-full border border-gray-300 table-auto">
            <thead class="bg-gray-100">
                <tr>
                    <th class="p-2 border">Tên</th>
                    <th class="p-2 border">CCCD</th>
                    <th class="p-2 border">Email</th>
                    <th class="p-2 border">Role</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in filteredUsers" :key="index">
                    <td class="p-2 border">{{ user.ten }}</td>
                    <td class="p-2 border">{{ user.cccd }}</td>
                    <td class="p-2 border">{{ user.email }}</td>
                    <td class="p-2 border">{{ user.role }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
