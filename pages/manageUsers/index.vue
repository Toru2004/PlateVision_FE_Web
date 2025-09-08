<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
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

const ADMIN_EMAIL = "adminsystem@gmail.com";
const ADMIN_PASSWORD = "123456";

const handleCreateUser = async (newUser: UserCreate) => {
    const auth = getAuth();
    try {
        loading.value = true;

        // Tạo user mới
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
        const uid = userCredential.user.uid;
        const { password, ...userData } = newUser;

        // Lưu thông tin vào Firestore
        await setDoc(doc(db, "thongtindangky", uid), { ...userData });

        // Đăng xuất user vừa tạo
        await signOut(auth);

        // Đăng nhập lại tài khoản admin
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);

        // Update UI
        users.value.push(userData);
        toast.success("Đã thêm thành công và quay lại admin");
    } catch (err: any) {
        console.error("Lỗi khi tạo user:", err);
        toast.error(err.message || "Thêm thất bại");
    } finally {
        loading.value = false;
    }
};

const handleCreateAdminSecurity = async (newUser: UserCreate) => {
    const auth = getAuth();
    try {
        loading.value = true;

        // Tạo user mới
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
        const { password, ...userData } = newUser;

        // Lưu vào Firestore
        const docRef = await addDoc(collection(db, "thongtindangky"), { ...userData });

        // Đăng xuất user vừa tạo
        await signOut(auth);

        // Đăng nhập lại admin
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);

        if (docRef && docRef.id) {
            users.value.push(userData);
            toast.success("Đã thêm thành công và quay lại admin");
        } else {
            throw new Error("Không nhận được ID từ Firestore.");
        }
    } catch (err: any) {
        console.error("Lỗi khi thêm người dùng:", err);
        toast.error(err.message || "Thêm thất bại");
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
