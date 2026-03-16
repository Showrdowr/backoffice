import type { RecentEnrollment } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface RecentEnrollmentsCardProps {
    enrollments: RecentEnrollment[];
}

export function RecentEnrollmentsCard({ enrollments }: RecentEnrollmentsCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100 overflow-hidden hover:shadow-xl transition-all">
            <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">การลงทะเบียนล่าสุด</h2>
                    <span className="px-3 py-1 bg-sky-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        ใหม่
                    </span>
                </div>
            </div>
            <div className="divide-y divide-slate-100">
                {enrollments.map((enrollment) => (
                    <div
                        key={enrollment.id}
                        className="p-5 flex items-center gap-4 hover:bg-sky-50/50 transition-all group cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center text-sky-600 font-bold text-lg shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                            {enrollment.userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{enrollment.userName}</p>
                            <p className="text-sm text-slate-500 truncate">{enrollment.courseName}</p>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                            {formatDistanceToNow(enrollment.enrolledAt, { addSuffix: true, locale: th })}
                        </span>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-sky-50/30 border-t border-sky-100">
                <button className="w-full text-sm text-sky-600 hover:text-sky-700 font-semibold py-2 hover:bg-white rounded-lg transition-all">
                    ดูทั้งหมด →
                </button>
            </div>
        </div>
    );
}
