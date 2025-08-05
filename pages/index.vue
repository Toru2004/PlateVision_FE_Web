<script setup lang="ts">
// import { UserRole } from '@/lib/enums';
// import { useAuthStore } from '@/stores/app/auth';
// import { userStore } from '@/stores/user';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

useHead({
  title: 'Home',
});

// definePageMeta({
//   layout: 'default',
//   middleware: () => {
//     const router = useRouter()=

//   const auth = getAuth()
//   const user = auth.currentUser

//   if (!user) {
//     return router.push('/auth/login')
//   }=

//   const role = userSnap.data().role

//     switch (role) {
//       case 'admin':
//         return router.push({
//           path: '/dashboard',
//         });
//       default:
//         return 'Khang cu bé'
//     }
//   },
// });
</script>

<template>
  <div />
</template>
