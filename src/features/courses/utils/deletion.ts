import type { Course, CourseAdminAction, CourseDeletionBlockers } from '../types';

const EMPTY_DELETION_BLOCKERS: CourseDeletionBlockers = {
    enrollmentsCount: 0,
    certificatesCount: 0,
    orderItemsCount: 0,
};

function normalizeCount(value: unknown) {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : 0;
}

export function normalizeCourseDeletionBlockers(value: unknown): CourseDeletionBlockers {
    if (!value || typeof value !== 'object') {
        return { ...EMPTY_DELETION_BLOCKERS };
    }

    const raw = value as Record<string, unknown>;
    return {
        enrollmentsCount: normalizeCount(raw.enrollmentsCount),
        certificatesCount: normalizeCount(raw.certificatesCount),
        orderItemsCount: normalizeCount(raw.orderItemsCount),
    };
}

export function canCourseBeHardDeleted(course?: Partial<Course> | null) {
    if (typeof course?.canHardDelete === 'boolean') {
        return course.canHardDelete;
    }

    const blockers = normalizeCourseDeletionBlockers(course?.deletionBlockers);
    return blockers.enrollmentsCount === 0
        && blockers.certificatesCount === 0
        && blockers.orderItemsCount === 0;
}

export function getCourseRecommendedAdminAction(course?: Partial<Course> | null): CourseAdminAction {
    if (course?.recommendedAdminAction === 'delete' || course?.recommendedAdminAction === 'archive') {
        return course.recommendedAdminAction;
    }

    return canCourseBeHardDeleted(course) ? 'delete' : 'archive';
}

export function getCourseDeletionBlockerItems(course?: Partial<Course> | null) {
    const blockers = normalizeCourseDeletionBlockers(course?.deletionBlockers);
    return [
        { key: 'enrollments', label: 'ผู้เรียน', count: blockers.enrollmentsCount },
        { key: 'certificates', label: 'ใบประกาศ', count: blockers.certificatesCount },
        { key: 'orders', label: 'คำสั่งซื้อ', count: blockers.orderItemsCount },
    ];
}

export function getCourseDeletionSummary(course?: Partial<Course> | null) {
    const items = getCourseDeletionBlockerItems(course);
    const activeItems = items.filter((item) => item.count > 0);

    if (activeItems.length === 0) {
        return 'คอร์สนี้สามารถลบถาวรได้';
    }

    return `ลบถาวรไม่ได้ เพราะมี${activeItems.map((item) => `${item.label} ${item.count}`).join(' • ')}`;
}

export function getCourseArchiveSummary(course?: Partial<Course> | null) {
    const items = getCourseDeletionBlockerItems(course);
    const activeItems = items.filter((item) => item.count > 0);

    if (activeItems.length === 0) {
        return 'ย้ายคอร์สไปเก็บถาวร';
    }

    return `คอร์สนี้มีประวัติใช้งานแล้ว จึงควรเก็บถาวรแทนการลบ (${activeItems.map((item) => `${item.label} ${item.count}`).join(' • ')})`;
}

export function buildCourseDeleteConflictMessage(blockers?: CourseDeletionBlockers) {
    const normalizedBlockers = normalizeCourseDeletionBlockers(blockers);
    const items = [
        `ผู้เรียน ${normalizedBlockers.enrollmentsCount}`,
        `ใบประกาศ ${normalizedBlockers.certificatesCount}`,
        `คำสั่งซื้อ ${normalizedBlockers.orderItemsCount}`,
    ];

    return `ลบคอร์สถาวรไม่ได้ เพราะมีประวัติใช้งานอยู่แล้ว (${items.join(' • ')}) กรุณาเปลี่ยนสถานะเป็น ARCHIVED แทน`;
}
