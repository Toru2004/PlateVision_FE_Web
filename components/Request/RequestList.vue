<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Danh sách yêu cầu</h1>
    <!-- searchbar dung để lọc dữ liệu -->
    <searchBar :data="allRequests" :fields="['name', 'cccd', 'email']" @filtered="handleFiltered" />
    <div v-if="loading">Đang tải...</div>
    <table v-else class="table-auto w-full border border-gray-300">
      <thead class="bg-gray-100">
        <tr class="bg-blue-600 text-white">
          <th class="p-2 border">Tên</th>
          <th class="p-2 border">CCCD</th>
          <th class="p-2 border">Email</th>
          <th class="p-2 border">Thời gian</th>
          <th class="p-2 border">Trạng thái</th>
        </tr>
      </thead>
      <tbody class="border-t">
        <tr v-for="(request, index) in fillteredRequests" :key="index">
          <td class="p-2 border">{{ request.name }}</td>
          <td class="p-2 border">{{ request.cccd }}</td>
          <td class="p-2 border">{{ request.email }}</td>
          <td class="p-2 border">{{ formatFirebaseTimestamp(request.timeRequest) }}</td>
          <td class="p-2 border">   
            <span :class="request.approved ? 'text-green-600' : 'text-red-600'">
              {{ request.approved ? 'Đã duyệt' : 'Chưa duyệt' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
//  Import type từ file khác
import type { RequestInfor } from '@/@type/Request';
//  Import hàm định dạng thời gian
import { formatFirebaseTimestamp } from '@/utils/date';
// khi search bar emit dữ liệu đã lọc, sẽ cập nhật fillteredRequests
import searchBar from '../organisms/searchBar.vue';
const allRequests = ref<RequestInfor[]>([]);
const fillteredRequests = ref<RequestInfor[]>([]);
function handleFiltered(filtered: RequestInfor[]) {
  fillteredRequests.value = filtered;
}
//  Định nghĩa props
interface Props {
  requests: Array<RequestInfor>;
  loading: boolean;
}

const props = defineProps<Props>();
onMounted(() => {
  // Khi component được mount, sẽ lấy dữ liệu từ props.requests
  allRequests.value = props.requests;
  fillteredRequests.value = props.requests; // Khởi tạo fillteredRequests với tất cả dữ liệu
});
watch(() => props.requests, (newRequests) => {
  // Cập nhật allRequests và fillteredRequests khi props.requests thay đổi
  allRequests.value = newRequests;
  fillteredRequests.value = newRequests;
});

</script>

<style lang="scss" scoped>
</style>
