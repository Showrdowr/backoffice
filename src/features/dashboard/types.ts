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

export interface WeeklyRevenuePoint {
    date: string;
    label: string;
    amount: number;
}

export interface DashboardSystemStatusItem {
    status: 'healthy' | 'degraded';
    label: string;
    detail?: string;
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
    weeklyRevenue: WeeklyRevenuePoint[];
    recentEnrollments: RecentEnrollment[];
    topCourses: TopCourse[];
    systemStatus: {
        api: DashboardSystemStatusItem;
        database: DashboardSystemStatusItem;
        videoProvider: DashboardSystemStatusItem;
    };
}
