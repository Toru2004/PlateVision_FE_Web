<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  collection,
  getFirestore,
  getDocs,
  onSnapshot
} from 'firebase/firestore'
import { firebaseApp } from '@/plugins/firebase'
import Infomation from '@/components/organisms/dashboard/Infomation.vue'

const db = getFirestore(firebaseApp)
const xeHienTai = ref<number>(0)
const xeRaVaoHomNay = ref<number>(0)
const soNguoiDangKy = ref<number>(0)
const tongYeuCau = ref<number>(0)

const lastXeHienTai = ref<number | null>(null)
const lastXeRaVaoHomNay = ref<number | null>(null)
const lastTongYeuCau = ref<number | null>(null)

const deltaXeHienTai = ref<number>(0)
const deltaXeRaVao = ref<number>(0)
const deltaYeuCau = ref<number>(0)

let unsubscribeListeners: (() => void)[] = []

// Hàm lấy ngày hôm nay dạng "ddMMyyyy"
function getTodayId(): string {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
  const yyyy = today.getFullYear()
  return `${dd}${mm}${yyyy}`
}

// Hàm đếm xe đang gửi hôm nay
async function fetchAndUpdateXeCount() {
  const lichSuRef = collection(db, 'lichsuhoatdong')
  const lichSuDocs = await getDocs(lichSuRef)

  const bienSoMap = new Map<string, { solanvao: number, solanra: number }>()
  const ngayHomNay = getTodayId()
  let demRaVaoHomNay = 0

  for (const ngayDoc of lichSuDocs.docs) {
    const ngayId = ngayDoc.id
    const xeRef = collection(db, 'lichsuhoatdong', ngayId, 'xe')
    const xeDocs = await getDocs(xeRef)

    for (const xeDoc of xeDocs.docs) {
      const bienSo = xeDoc.id
      const data = xeDoc.data()

      const vao = data.solanvao || 0
      const ra = data.solanra || 0

      // Cộng dồn số lần vào ra theo từng ngày
      if (bienSoMap.has(bienSo)) {
        const current = bienSoMap.get(bienSo)!
        bienSoMap.set(bienSo, {
          solanvao: current.solanvao + vao,
          solanra: current.solanra + ra,
        })
      } else {
        bienSoMap.set(bienSo, {
          solanvao: vao,
          solanra: ra,
        })
      }
      // Nếu ngày hiện tại và xe có hoạt động → đếm vào thống kê hôm nay
      if (ngayId === ngayHomNay && (vao > 0 || ra > 0)) {
        demRaVaoHomNay++
      }
    }
  }

  let count = 0
  for (const { solanvao, solanra } of bienSoMap.values()) {
    if (solanvao > solanra) {
      count++
    }
  }

  deltaXeHienTai.value = lastXeHienTai.value !== null ? count - lastXeHienTai.value : 0
  deltaXeRaVao.value = lastXeRaVaoHomNay.value !== null ? demRaVaoHomNay - lastXeRaVaoHomNay.value : 0

  lastXeHienTai.value = count
  lastXeRaVaoHomNay.value = demRaVaoHomNay

  xeHienTai.value = count
  xeRaVaoHomNay.value = demRaVaoHomNay
}

// Lắng nghe thay đổi trong timeline của từng xe trong ngày hôm nay
async function setupRealtimeListener() {
  const ngayId = getTodayId()
  const xeRef = collection(db, 'lichsuhoatdong', ngayId, 'xe')

  const unsub = onSnapshot(xeRef, async () => {
    await fetchAndUpdateXeCount()
  })

  unsubscribeListeners.push(unsub)

  await fetchAndUpdateXeCount()
}

function listenSoNguoiDangKy() {
  const refDangKy = collection(db, 'thongtindangky')
  const unsub = onSnapshot(refDangKy, (snapshot) => {
    const users = snapshot.docs.filter(doc => {
      const data = doc.data()
      return data.role !== 'admin'
    })
    soNguoiDangKy.value = users.length
  })
  unsubscribeListeners.push(unsub)
}

function listenTongYeuCau() {
  const yeuCauRef = collection(db, 'lichsuyeucau')
  const unsub = onSnapshot(yeuCauRef, (snapshot) => {
    tongYeuCau.value = snapshot.size
    if (lastTongYeuCau.value !== null) {
      deltaYeuCau.value = tongYeuCau.value - lastTongYeuCau.value
    }
    lastTongYeuCau.value = tongYeuCau.value
  })
  unsubscribeListeners.push(unsub)
}

onMounted(() => {
  setupRealtimeListener()
  listenSoNguoiDangKy()
  listenTongYeuCau()
})

onUnmounted(() => {
  unsubscribeListeners.forEach((unsub) => unsub())
})

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <Infomation :xeHienTai="xeHienTai" :deltaXeHienTai="deltaXeHienTai" :xeRaVaoHomNay="xeRaVaoHomNay"
    :deltaXeRaVao="deltaXeRaVao" :soNguoiDangKy="soNguoiDangKy" :tongYeuCau="tongYeuCau" :deltaYeuCau="deltaYeuCau" />
</template>