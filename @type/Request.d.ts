import type { Timestamp } from "firebase/firestore";

export type RequestInfor={
    name: string;
    cccd: string;
    email: string;
    timeRequest: Timestamp;
    approved: boolean;
}
