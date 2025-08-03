<script setup lang="ts">
interface Props {
  users: Array<UserRegister>
  loading: boolean
}

interface Emits {
  (event: 'delete', selectedId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClickDeleteItem = (id: string) => {
    emit('delete', id);
};

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Danh sách đăng ký</h1>
    <div v-if="loading">Đang tải...</div>
    <table v-else class="table-auto w-full border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">Biển số xe</th>
          <th class="p-2 border">Email</th>
          <th class="p-2 border">MSSV</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td class="p-2 border">{{ user.biensoxe }}</td>
          <td class="p-2 border">{{ user.email }}</td>
          <td class="p-2 border">{{ user.mssv }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
