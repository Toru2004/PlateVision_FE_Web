// plugins/vuefire.ts
// import { VueFire, VueFireAuth } from 'vuefire'
// import { firebaseApp } from '@/plugins/firebase'

// export default defineNuxtPlugin((nuxtApp) => {
//   nuxtApp.vueApp.use(VueFire, {
//     firebaseApp,
//     modules: [VueFireAuth()],
//   })
// })

import { firebaseApp } from './firebase'
import { VueFire, VueFireAuth } from 'vuefire'

export default defineNuxtPlugin((nuxtApp) => {
  if (!firebaseApp) {
    throw new Error('Firebase app was not initialized.')
  }

  nuxtApp.vueApp.use(VueFire, {
    firebaseApp: firebaseApp,
    modules: [VueFireAuth()],
  })
})


