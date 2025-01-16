import { ReportData } from "./ReportData";

export interface MachineData {
  id: number | null;
  machine: string | null;
  machineStatus: string | null;
  partsMade: number | null;
  comments: string | null;
  assignedReportId: number | null;
  assignedReport: ReportData | null;
}
