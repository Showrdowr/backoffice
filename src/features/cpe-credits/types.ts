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

// Mock data for CPE credits
export const MOCK_CPE_RECORDS: CpeRecord[] = [
    {
        id: '1',
        pharmacistId: 'ph1',
        pharmacistName: 'ภก.สุรชัย เก่งมาก',
        licenseNumber: 'ภ.12345',
        courseId: 'c1',
        courseName: 'การดูแลผู้ป่วยโรคเรื้อรัง',
        credits: 3,
        completedAt: '2024-12-20'
    },
    {
        id: '2',
        pharmacistId: 'ph2',
        pharmacistName: 'ภญ.วิภา รักการสอน',
        licenseNumber: 'ภ.23456',
        courseId: 'c2',
        courseName: 'เภสัชกรรมคลินิกขั้นสูง',
        credits: 5,
        completedAt: '2024-12-19'
    },
    {
        id: '3',
        pharmacistId: 'ph3',
        pharmacistName: 'ภก.ณัฐพล มีความรู้',
        licenseNumber: 'ภ.34567',
        courseId: 'c3',
        courseName: 'กฎหมายเภสัชกรรม 2024',
        credits: 2,
        completedAt: '2024-12-18'
    },
    {
        id: '4',
        pharmacistId: 'ph4',
        pharmacistName: 'ภญ.ปิยะ ใจดี',
        licenseNumber: 'ภ.45678',
        courseId: 'c4',
        courseName: 'ทักษะการสื่อสารกับผู้ป่วย',
        credits: 2,
        completedAt: '2024-12-17'
    },
    {
        id: '5',
        pharmacistId: 'ph5',
        pharmacistName: 'ภก.สมชาย รักเรียน',
        licenseNumber: 'ภ.56789',
        courseId: 'c5',
        courseName: 'เภสัชกรรมชุมชนยุคใหม่',
        credits: 4,
        completedAt: '2024-12-16'
    },
];

export const MOCK_CPE_STATS: CpeStats = {
    totalCreditsThisMonth: 1245,
    pharmacistsReceived: 856,
    coursesWithCpe: 45,
    totalCreditsThisYear: 18456,
};
