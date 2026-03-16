import { BookOpen, Clock, CheckCircle } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    progress: number;
    status: 'completed' | 'in-progress' | 'not-started';
    enrolledDate: string;
}

interface UserCoursesTabProps {
    courses: Course[];
}

export function UserCoursesTab({ courses }: UserCoursesTabProps) {
    if (courses.length === 0) {
        return (
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border-2 border-dashed border-sky-200 p-12 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <BookOpen size={32} className="text-sky-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">ยังไม่มีคอร์สที่ลงทะเบียน</h3>
                <p className="text-slate-500">ผู้ใช้ยังไม่ได้ลงทะเบียนเรียนคอร์สใดๆ</p>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">เรียนจบแล้ว</span>;
            case 'in-progress':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">กำลังเรียน</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">ยังไม่เริ่ม</span>;
        }
    };

    return (
        <div className="space-y-3">
            {courses.map((course) => (
                <div
                    key={course.id}
                    className="bg-white border border-sky-100 rounded-xl p-5 hover:shadow-md hover:border-sky-200 transition-all"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 mb-2">{course.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    ลงทะเบียน: {new Date(course.enrolledDate).toLocaleDateString('th-TH')}
                                </span>
                            </div>
                        </div>
                        {getStatusBadge(course.status)}
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-600">ความคืบหน้า</span>
                            <span className="font-semibold text-sky-600">{course.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full transition-all"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                    </div>

                    {course.status === 'completed' && (
                        <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle size={16} />
                            <span className="font-medium">ผ่านคอร์สนี้แล้ว</span>
                        </div>
                    )}
                </div>
            ))}

            {/* Summary */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-100 p-4 mt-6">
                <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">รวมทั้งหมด</span>
                    <span className="text-sky-600 font-bold">{courses.length} คอร์ส</span>
                </div>
            </div>
        </div>
    );
}
