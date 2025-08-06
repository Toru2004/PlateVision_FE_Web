<template>
  <div class="relative w-full max-w-md mx-auto">
    <input
      type="text"
      v-model="searchText"
      :placeholder="props.placeholder || 'Tìm kiếm...'"
      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
    <!-- Icon tìm kiếm -->
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { searchByKeyword } from '@/utils/search'

interface Props<T> {
  data: T[]
  fields: (keyof T)[]
  placeholder?: string
}

const props = defineProps<Props<any>>() // generic
const emit = defineEmits<{
  (e: 'filtered', value: any[]): void
}>()

const searchText = ref('')

// Watch input text và emit dữ liệu lọc
watch(searchText, () => {
  const filtered = searchByKeyword(props.data, searchText.value, props.fields)
  emit('filtered', filtered)
})
</script>

<style scoped>
</style>
