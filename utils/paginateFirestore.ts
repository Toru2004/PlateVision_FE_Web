import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

// Định nghĩa kiểu trả về của hàm phân trang
type PaginateResult<T> = {
  data: T[];               // Dữ liệu đã lấy ra (mảng object kiểu T)
  lastDoc: any;            // Document cuối cùng trong batch hiện tại (dùng cho phân trang tiếp theo)
  hasNext: boolean;        // Có còn trang tiếp theo hay không (true nếu số lượng đủ limit)
};

/**
 * Hàm phân trang dữ liệu từ Firestore - tái sử dụng cho mọi collection
 *
 * @param collectionPath   Đường dẫn đến collection trong Firestore (vd: 'lichsuyeucau')
 * @param orderByField     Tên field dùng để sắp xếp (phải có trong document, ví dụ: 'createdAt' hoặc 'time')
 * @param limitCount       Số lượng document mỗi trang
 * @param lastVisible      Document cuối của trang trước đó (dùng cho trang kế tiếp)
 * @param firestoreInstance Firestore instance (thường là `useNuxtApp().$firestore`)
 *
 * @returns Dữ liệu đã phân trang, document cuối cùng để dùng tiếp theo, và cờ `hasNext`
 */
export async function paginateFirestore<T>({
  collectionPath,
  orderByField,
  limitCount,
  lastVisible,
  firestoreInstance,
}: {
  collectionPath: string;
  orderByField: string;
  limitCount: number;
  lastVisible?: any;
  firestoreInstance: any;
}): Promise<PaginateResult<T>> {
  // Tạo tham chiếu đến collection trong Firestore
  const colRef = collection(firestoreInstance, collectionPath);

  let q;

  // Nếu có lastVisible (đã phân trang trước đó), thì dùng startAfter để lấy batch tiếp theo
  if (lastVisible) {
    q = query(
      colRef,
      orderBy(orderByField, 'desc'),
      startAfter(lastVisible),
      limit(limitCount)
    );
  } else {
    // Nếu chưa có lastVisible (trang đầu tiên), chỉ cần order và limit
    q = query(
      colRef,
      orderBy(orderByField, 'desc'),
      limit(limitCount)
    );
  }

  // Thực hiện truy vấn
  const snapshot = await getDocs(q);

  // Map dữ liệu từ snapshot thành mảng object kiểu T
  const docs = snapshot.docs.map((doc) => doc.data() as T);

  // Trả về kết quả phân trang
  return {
    data: docs,                                         // Dữ liệu thực tế
    lastDoc: snapshot.docs[snapshot.docs.length - 1],   // Document cuối cùng (dùng để lấy trang sau)
    hasNext: snapshot.size === limitCount,              // Có còn trang tiếp theo hay không
  };
}
