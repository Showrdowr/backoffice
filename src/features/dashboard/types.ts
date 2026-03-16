// Dashboard specific types
export interface DashboardStats {
    totalUsers: number;
    totalCourses: number;
    monthlyRevenue: number;
    cpeCreditsIssued: number;
    usersChange: number;
    coursesChange: number;
    revenueChange: number;
    cpeCreditsChange: number;
}

export interface RecentEnrollment {
    id: string;
    userName: string;
    courseName: string;
    enrolledAt: Date;
}

export interface TopCourse {
    id: string;
    name: string;
    title: string;
    enrollments: number;
    revenue: number;
}

export interface DashboardData {
    stats: DashboardStats;
    recentEnrollments: RecentEnrollment[];
    topCourses: TopCourse[];
}
