import { getCurrentUser } from 'vuefire'
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'

export default defineNuxtRouteMiddleware(async (to) => {
  const user = await getCurrentUser()

  // Trường hợp chưa đăng nhập
  if (!user) {
    if (to.path !== '/auth/login') return navigateTo('/auth/login')
    return
  }

  // Trường hợp đã đăng nhập mà vào lại trang login
  if (to.path === '/auth/login') {
    return navigateTo('/dashboard')
  }

  const { $firestore } = useNuxtApp()
  const db = $firestore as ReturnType<typeof getFirestore>

  try {
    // Truy vấn tài khoản theo email
    const q = query(
      collection(db, 'thongtindangky'),
      where('email', '==', user.email || ''),
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return navigateTo('/auth/login')
    }

    const docData = snapshot.docs[0].data()
    const role = docData.role

    // Điều hướng theo role (nếu đang ở trang root '/')
    if (to.path === '/') {
      switch (role) {
        case 'admin':
          return navigateTo('/dashboard')
        default:
          return navigateTo('/welcome') // hoặc route nào khác phù hợp
      }
    }
  } catch (error) {
    console.error('Middleware error:', error)
    return navigateTo('/auth/login')
  }
})
