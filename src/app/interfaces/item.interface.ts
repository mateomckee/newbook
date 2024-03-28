export interface ItemData {
  key: number;
  crn: number;
  semester: string;
  courselabel: string;
  instructor: string;
  coursetitle: string;
  inseval: number | null;
  insevalstudentnum: number | null;
  creval: number | null;
  crevalstudentnum: number | null;
  enrollment: number;
  description: string;
  timestamp: string;
}