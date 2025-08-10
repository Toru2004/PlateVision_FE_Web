import { collection,addDoc,type Firestore,getDocs,doc,updateDoc  } from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";

const { $firestore } = useNuxtApp();
const db = $firestore as Firestore;
export async function saveRequestFireBase(lines: string[], approve: boolean) {
  try {
    // Tạo object lưu trữ dữ liệu
    const data: Record<string, string | boolean> = { approve };

    // Duyệt từng dòng để tách key và value
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length > 0) {
        data[key.trim()] = rest.join(':').trim();
      }
    });

    const docRef = await addDoc(collection(db, "lichsuyeucau"), data);

    console.log("Đã lưu dữ liệu với ID:", docRef.id);
  } catch (error) {
    console.log("Lỗi khi lưu dữ liệu lên Firestore:", error);
  }
}
export async function editStatus(RequestPort: boolean,timeport:string) {
    try{
        const statusColletion=collection(db,"Status");
        const querySnapshot=await getDocs(statusColletion);
        if (querySnapshot.empty){
            console.log("khong co colletion trong status");
            return;
        }
        const docSnapshot=querySnapshot.docs[0];
        const docRef=doc(db,"Status",docSnapshot.id);
        await updateDoc(docRef,{
            RequestPort,
            timeport
        });
       console.log("Cập nhật thành công document ID:", docSnapshot.id);
  } catch (error) {
    console.error("Lỗi khi cập nhật document:", error);
  }
}

