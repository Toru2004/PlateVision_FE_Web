<script setup lang="ts">
import { addDoc, collection, doc, getDocs, type Firestore } from "firebase/firestore";
import UserList from "@/components/organisms/users/UserList.vue";
import Loading from "@/components/atoms/Loading.vue";
import FormAddUser from "@/components/organisms/users/FormAddUser.vue";
import { toast } from "vue3-toastify";
definePageMeta({
    layout: "default",
});

const { $firestore } = useNuxtApp();
const db = $firestore as Firestore;

const users = ref<UserRegister[]>([]);

// const users = ref<{ biensoxe: string; email: string; cccd: string }[]>([])
const loading = ref(false);
const isModalOpen = ref(false);

const fetchData = async (): Promise<void> => {
    try {
        loading.value = true;
        const querySnapshot = await getDocs(collection(db, "thongtindangky"));
        users.value = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const biensophuData = data.biensophu ?? {};
            return {
                ten: data.ten ?? "",
                biensoxe: data.biensoxe ?? "",
                biensophu: {
                    bienSo: biensophuData.bienSo ?? "",
                    createdAt: biensophuData.createdAt ?? 0,
                    ngayHetHan: biensophuData.ngayHetHan ?? 0,
                },
                email: data.email ?? "",
                cccd: data.cccd ?? "",
                role: data.role ?? "user",
            };
        });
    } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
    } finally {
        loading.value = false;
    }
};

const handleClickDelete = (selectedId: string): void => {
    console.log("Minh cu bé");
};

const handleCreateUser = async (newUser: UserRegister) => {
    try {
        loading.value = true;
        const docRef = await addDoc(collection(db, "thongtindangky"), {
            ...newUser,
        });
        if (docRef && docRef.id) {
            console.log("User mới:", newUser);
            users.value.push(newUser);
            toast.success("Đã thêm thành công"); // ✅ chỉ khi thật sự thành công mới hiển thị
        } else {
            throw new Error("Không nhận được ID từ Firestore.");
        }
    } catch (err) {
        console.error("Lỗi khi thêm người dùng:", err);
        toast.error("Thêm thất bại");
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>

<template>
    <Loading icon="ball-triangle" :show="loading" color="#1e40af" />
    <UserList :users="users" :loading="loading" @delete="handleClickDelete" v-model:isModalOpen="isModalOpen" />
    <FormAddUser v-model:isModalOpen="isModalOpen" v-model:loading="loading" @create="handleCreateUser" />
</template>
