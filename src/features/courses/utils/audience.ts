import type { CourseAudience } from '../types';

export const COURSE_AUDIENCE_OPTIONS: Array<{ value: CourseAudience; label: string; description: string }> = [
    { value: 'all', label: 'ทุกคน', description: 'แสดงให้ทุก role รวมถึงผู้ใช้ที่ยังไม่ล็อกอิน' },
    { value: 'general', label: 'บุคคลธรรมดา', description: 'แสดงให้บุคคลธรรมดาและเภสัชกร' },
    { value: 'pharmacist', label: 'เภสัชกร', description: 'แสดงเฉพาะเภสัชกร แต่ผู้ที่ยังไม่ล็อกอินยังเห็นหน้าคอร์สได้' },
];

export function normalizeCourseAudience(value?: string | null): CourseAudience {
    const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
    if (normalized === 'general' || normalized === 'pharmacist') {
        return normalized;
    }

    return 'all';
}

export function getCourseAudienceLabel(value?: string | null) {
    return COURSE_AUDIENCE_OPTIONS.find((option) => option.value === normalizeCourseAudience(value))?.label || 'ทุกคน';
}

export function getCourseAudienceBadgeClass(value?: string | null) {
    switch (normalizeCourseAudience(value)) {
        case 'general':
            return 'bg-cyan-100 text-cyan-700 border-cyan-200';
        case 'pharmacist':
            return 'bg-violet-100 text-violet-700 border-violet-200';
        default:
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
}
