// Users feature types
export interface User {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    joined: Date;
    courses: number;
}

export interface Pharmacist extends User {
    license: string;
    cpeCredits: number;
}

export interface UserStats {
    total: number;
    active: number;
    inactive: number;
}

export interface PharmacistStats extends UserStats {
    totalCpeCredits: number;
    averageCpeCredits: number;
}

export interface UsersData {
    users: User[];
    stats: UserStats;
}

export interface PharmacistsData {
    pharmacists: Pharmacist[];
    stats: PharmacistStats;
}

export interface UserOverviewProfile {
    id: string;
    fullName: string;
    email: string;
    role: 'member' | 'pharmacist' | 'admin';
    professionalLicenseNumber: string | null;
    createdAt: Date;
    accountStatus: 'active' | 'inactive';
    failedAttempts: number;
}

export interface UserOverviewSummary {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    averageWatchPercent: number;
    totalSpent: number;
    earnedCpeCredits: number;
}

export interface UserOverviewEnrollment {
    id: string;
    courseId: string;
    courseTitle: string;
    watchPercent: number;
    completionPercent: number;
    isCompleted: boolean;
    enrolledAt: Date;
    cpeCredits: number;
    certificateCode: string | null;
}

export interface UserOverviewTransaction {
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    courseTitles: string[];
}

export interface UserOverviewCertificate {
    id: string;
    certificateCode: string;
    issuedAt: Date;
    courseId: string;
    courseTitle: string;
    cpeCredits: number;
}

export interface UserOverviewResponse {
    profile: UserOverviewProfile;
    summary: UserOverviewSummary;
    enrollments: UserOverviewEnrollment[];
    transactions: UserOverviewTransaction[];
    certificates: UserOverviewCertificate[];
}
