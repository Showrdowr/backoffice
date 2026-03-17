// CPE Credits Feature Types

export interface CpeRecord {
    id: string;
    pharmacistId: string;
    pharmacistName: string;
    licenseNumber: string;
    courseId: string;
    courseName: string;
    credits: number;
    completedAt: string;
    certificateUrl?: string;
}

export interface CpeStats {
    totalCreditsThisMonth: number;
    pharmacistsReceived: number;
    coursesWithCpe: number;
    totalCreditsThisYear: number;
}

