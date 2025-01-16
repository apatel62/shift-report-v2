import { UserData } from "./UserData";

export interface ReportData {
  id: number | null;
  shiftNumber: string | null;
  date: Date | null;
  assignedUserId: number | null;
  assignedUser: UserData | null;
}
