<script setup lang="ts">
import { addDoc, collection, doc, getDocs, setDoc, type Firestore } from "firebase/firestore";
import UserList from "@/components/organisms/manageUsers/UserList.vue";
import Loading from "@/components/atoms/Loading.vue";
import FormAddUser from "@/components/organisms/manageUsers/FormAddUser.vue";
import FormAddAdminSecurity from "@/components/organisms/manageUsers/FormAddAdminSecurity.vue";
import { toast } from "vue3-toastify";
definePageMeta({
    layout: "default",
});

const { $firestore } = useNuxtApp();
const db = $firestore as Firestore;

const users = ref<UserRegister[]>([]);

// const users = ref<{ biensoxe: string; email: string; cccd: string }[]>([])
const loading = ref(false);
const isOpenAddAdminSecurityModal = ref(false);
const isOpenAddUserModal = ref(false);

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

const handleOpenAddAdminSecurityModal = (): void => {
    isOpenAddAdminSecurityModal.value = true;
};

const handleOpenAddUserModal = (): void => {
    isOpenAddUserModal.value = true;
};

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const handleCreateUser = async (newUser: UserCreate) => {
    try {
        loading.value = true;

        //Tạo user trong Firebase Authentication
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);

        const uid = userCredential.user.uid;
        const { password, ...userData } = newUser;

        //Lưu thông tin vào Firestore (dùng uid làm document ID)
        const docRef = await setDoc(doc(db, "thongtindangky", uid), {
            ...userData,
        });

        //Cập nhật state/UI
        console.log("User mới:", newUser);
        users.value.push({ ...newUser });
        toast.success("Đã thêm thành công");
    } catch (err: any) {
        console.error("Lỗi khi tạo user:", err);
        toast.error(err.message || "Thêm thất bại");
    } finally {
        loading.value = false;
    }
};

const handleCreateAdminSecurity = async (newUser: UserCreate) => {
    try {
        loading.value = true;
        //Tạo user trong Firebase Authentication
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);

        const uid = userCredential.user.uid;
        const { password, ...userData } = newUser;
        const docRef = await addDoc(collection(db, "thongtindangky"), {
            ...userData,
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
    <UserList
        :users="users"
        :loading="loading"
        @delete="handleClickDelete"
        @open-add-user-modal="handleOpenAddUserModal"
        @open-add-admin-security-modal="handleOpenAddAdminSecurityModal"
    />
    <FormAddUser v-model:isModalOpen="isOpenAddUserModal" v-model:loading="loading" @create="handleCreateUser" />
    <FormAddAdminSecurity
        v-model:isModalOpen="isOpenAddAdminSecurityModal"
        v-model:loading="loading"
        @create="handleCreateAdminSecurity"
    />
</template>
