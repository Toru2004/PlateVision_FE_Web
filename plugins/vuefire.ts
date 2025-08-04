// plugins/vuefire.ts
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from '@/plugins/firebase'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  })
})
