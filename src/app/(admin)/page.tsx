'use client';

import { useDashboard } from '@/features/dashboard/hooks';
import { StatCard, getStatIcon, getStatColor } from '@/features/dashboard/components/StatCard';
import { formatCurrency, formatNumber } from '@/utils/format';
import {
  Users, BookOpen, CreditCard, Award, TrendingUp, ArrowRight, Calendar,
  Clock, CheckCircle, AlertTriangle, BarChart3, Plus, Eye
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

// Mock weekly revenue data for chart
const weeklyRevenue = [
  { day: 'จ.', amount: 12500 },
  { day: 'อ.', amount: 18200 },
  { day: 'พ.', amount: 15800 },
  { day: 'พฤ.', amount: 22100 },
  { day: 'ศ.', amount: 28500 },
  { day: 'ส.', amount: 14200 },
  { day: 'อา.', amount: 8900 },
];

const maxAmount = Math.max(...weeklyRevenue.map(d => d.amount));

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ลองอีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { type: 'users', title: 'ผู้ใช้ทั้งหมด', value: formatNumber(data.stats.totalUsers), change: data.stats.usersChange },
    { type: 'courses', title: 'คอร์สทั้งหมด', value: String(data.stats.totalCourses), change: data.stats.coursesChange },
    { type: 'revenue', title: 'รายได้เดือนนี้', value: formatCurrency(data.stats.monthlyRevenue), change: data.stats.revenueChange },
    { type: 'cpeCredits', title: 'CPE Credits ออก', value: formatNumber(data.stats.cpeCreditsIssued), change: data.stats.cpeCreditsChange },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">แดชบอร์ด</h1>
          <p className="text-slate-500 flex items-center gap-2 text-sm md:text-base mt-1">
            <Calendar size={16} />
            {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          href="/courses/add"
          className="flex items-center justify-center gap-2 px-5 md:px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm md:text-base touch-target"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">เพิ่มคอร์สใหม่</span>
          <span className="sm:hidden">เพิ่มคอร์ส</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.type}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={getStatIcon(stat.type)}
            color={getStatColor(stat.type)}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
            <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">รายได้รายสัปดาห์</h3>
                  <p className="text-sm text-slate-500">7 วันล่าสุด</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-blue-600">฿{(weeklyRevenue.reduce((a, b) => a + b.amount, 0) / 1000).toFixed(1)}k</p>
                <p className="text-sm text-emerald-600 flex items-center gap-1 sm:justify-end">
                  <TrendingUp size={14} />
                  +15% จากสัปดาห์ก่อน
                </p>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex items-end justify-between gap-2 md:gap-3 h-32 md:h-40">
                {weeklyRevenue.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-indigo-500"
                      style={{ height: `${(day.amount / maxAmount) * 100}%` }}
                    />
                    <span className="text-xs font-medium text-slate-500">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
            <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">ลงทะเบียนล่าสุด</h3>
                  <p className="text-sm text-slate-500">ผู้ใช้ใหม่</p>
                </div>
              </div>
              <Link href="/users" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                <span className="hidden sm:inline">ดูทั้งหมด</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {data.recentEnrollments.slice(0, 5).map((enrollment) => (
                <div key={enrollment.id} className="p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:bg-slate-50 transition-all">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    {enrollment.userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate text-sm md:text-base">{enrollment.userName}</p>
                    <p className="text-sm text-slate-500 truncate">{enrollment.courseName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(enrollment.enrolledAt, { addSuffix: true, locale: th })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl shadow-xl p-4 md:p-6 text-white">
            <h3 className="font-bold text-lg mb-4">การดำเนินการด่วน</h3>
            <div className="space-y-3">
              <Link href="/courses/add" className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all touch-target">
                <Plus size={20} />
                <span className="font-medium">เพิ่มคอร์สใหม่</span>
              </Link>
              <Link href="/users/pharmacists" className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all touch-target">
                <Users size={20} />
                <span className="font-medium">จัดการเภสัชกร</span>
              </Link>
              <Link href="/payments/transactions" className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all touch-target">
                <CreditCard size={20} />
                <span className="font-medium">ดูรายการธุรกรรม</span>
              </Link>
              <Link href="/payments/coupons" className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all touch-target">
                <Award size={20} />
                <span className="font-medium">จัดการคูปอง</span>
              </Link>
            </div>
          </div>

          {/* Top Courses */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
            <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-slate-800">คอร์สยอดนิยม</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {data.topCourses.slice(0, 4).map((course, idx) => (
                <div key={course.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                      idx === 1 ? 'bg-slate-300 text-slate-700' :
                        idx === 2 ? 'bg-amber-600 text-white' :
                          'bg-slate-200 text-slate-600'
                    }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{course.title}</p>
                    <p className="text-xs text-slate-500">{course.enrollments} ลงทะเบียน</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link href="/courses" className="w-full text-center block text-sm text-blue-600 hover:text-blue-700 font-semibold py-2 hover:bg-blue-50 rounded-lg transition-all">
                ดูคอร์สทั้งหมด →
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-500" />
              สถานะระบบ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 text-sm">API Server</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">ปกติ</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 text-sm">Database</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">ปกติ</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 text-sm">Storage</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">78% ใช้งาน</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
