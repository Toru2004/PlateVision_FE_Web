<script setup lang="ts">
import { signInWithEmailAndPassword, signOut, type Auth } from 'firebase/auth'
import { getDocs, collection, query, where, type Firestore } from 'firebase/firestore'

definePageMeta({
  layout: 'auth',
})

const { $firebaseAuth, $firestore } = useNuxtApp()
const auth = $firebaseAuth as Auth
const firestore = $firestore as Firestore

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    if (!user.email) {
      errorMsg.value = 'Không lấy được email từ Firebase Auth.'
      return
    }

    // 🔍 Truy vấn Firestore theo email
    const q = query(
      collection(firestore, 'thongtindangky'),
      where('email', '==', user.email)
    )
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      errorMsg.value = 'Tài khoản không tồn tại trong hệ thống.'
      return
    }

    const userData = querySnapshot.docs[0].data()
    const role = userData.role

    // ✅ Điều hướng theo role
    if (role === 'admin') {
      router.push('/dashboard')
    } else {
      await signOut(auth)
      errorMsg.value = 'Tài khoản không có quyền truy cập.'
    }
  } catch (error: any) {
    errorMsg.value = 'Đăng nhập thất bại: ' + error.message
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">PlateVision Admin</h1>
        <p class="text-sm text-gray-500 mt-1">Đăng nhập để quản lý bãi đỗ xe</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm"
              @click="showPassword = !showPassword"
            >
              <!-- {{ showPassword ? 'Ẩn' : 'Hiện' }} -->
              <Icon v-if="showPassword" name="EyeOff" :size="16" />
              <Icon v-else name="Eye" :size="16" />
            </button>
          </div>
        </div>

        <div v-if="errorMsg" class="text-sm text-red-600 font-medium">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition duration-200"
        >
          Đăng nhập
        </button>
      </form>

      <div class="mt-6 text-center text-xs text-gray-400">
        © {{ new Date().getFullYear() }} PlateVision. All rights reserved.
      </div>
    </div>
  </div>
</template>
