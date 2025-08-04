<script setup lang="ts">
import { collection, getDocs, type Firestore } from 'firebase/firestore'
import UserList from '@/components/organisms/users/UserList.vue'

definePageMeta({
  layout: 'default',
});

const { $firestore } = useNuxtApp()
const db = $firestore as Firestore

const users = ref<UserRegister[]>([])

// const users = ref<{ biensoxe: string; email: string; mssv: string }[]>([])
const loading = ref(false)

const fetchData = async (
): Promise<void> => {
  try {
    loading.value = true
    const querySnapshot = await getDocs(collection(db, 'thongtindangky'))
    users.value = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        biensoxe: data.biensoxe ?? data.biensophu?.bienSo ?? '',
        email: data.email ?? '',
        mssv: data.mssv ?? '',
      }
    })
  } catch (err) {
    console.error('Lỗi lấy dữ liệu:', err)
  } finally {
    loading.value = false
  }
};

const handleClickDelete = (selectedId: string): void => {
  console.log('Minh cu bé')
};

onMounted(() => {
  fetchData()
})
</script>

<template>
  <UserList :users="users" :loading="loading" @delete="handleClickDelete" />
</template>
