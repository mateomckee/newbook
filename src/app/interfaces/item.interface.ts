export interface ItemData {
    index: number;

    crn: number; //Example: 35701

    semester: string; //Example: Fall 2023

    courseLabel: string; //Example: CS 4423.001
    courseTitle: string; //Example: Game Development

    instructor: string; //Example: Ang, Samuel Vincent

    description: string;

    enrollment: number;

    instructorEval: number; //Example: 0.96
    instructorEvalStudentNum: number; //Example: 42

    courseEval: number;
    courseEvalStudentNum: number;

    timestamp: Date;
}