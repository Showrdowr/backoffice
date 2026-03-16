import type { TopCourse } from '../types';
import { formatCurrency, formatNumber } from '@/utils/format';

interface TopCoursesCardProps {
    courses: TopCourse[];
}

export function TopCoursesCard({ courses }: TopCoursesCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100 overflow-hidden hover:shadow-xl transition-all">
            <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">คอร์สยอดนิยม</h2>
                    <span className="px-3 py-1 bg-violet-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        Top {courses.length}
                    </span>
                </div>
            </div>
            <div className="divide-y divide-slate-100">
                {courses.map((course, index) => (
                    <div
                        key={course.id}
                        className="p-5 flex items-center gap-4 hover:bg-violet-50/30 transition-all group cursor-pointer"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all ${index === 0
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white'
                                : index === 1
                                    ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
                                    : index === 2
                                        ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                                        : 'bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600'
                            }`}>
                            {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate mb-1">{course.name}</p>
                            <p className="text-sm text-slate-500">{formatNumber(course.enrollments)} ลงทะเบียน</p>
                        </div>
                        <span className="text-sm font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg">
                            {formatCurrency(course.revenue)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-violet-50/30 border-t border-violet-100">
                <button className="w-full text-sm text-violet-600 hover:text-violet-700 font-semibold py-2 hover:bg-white rounded-lg transition-all">
                    ดูทั้งหมด →
                </button>
            </div>
        </div>
    );
}
