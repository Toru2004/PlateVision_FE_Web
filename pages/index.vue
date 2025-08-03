<script setup lang="ts">
// import { UserRole } from '@/lib/enums';
// import { useAuthStore } from '@/stores/app/auth';
// import { userStore } from '@/stores/user';

useHead({
  title: 'Home',
});

definePageMeta({
  layout: 'default',
  middleware: () => {
    const router = useRouter();
    const role: string = 'admin';

    switch (role) {
      case 'admin':
        return router.push({
          path: '/dashboard',
        });
      default:
        return 'Khang cu bé'
    }
  },
});
</script>

<template>
  <div />
</template>
