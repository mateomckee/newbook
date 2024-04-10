export interface ItemData {
  index: number;
  crn: number;
  semester: string;
  section: string;
  courselabel: string;
  coursetitle: string;
  instructor: string;
  inseval: number | null;
  insevalstudentnum: number | null;
  creval: number | null;
  crevalstudentnum: number | null;
  enrollment: number;
  description: string;
  timestamp: string;
  syllabusUrl: string;
}