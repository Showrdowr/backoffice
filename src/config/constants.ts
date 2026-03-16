// API Configuration
export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    timeout: 30000,
} as const;

// App Configuration
export const APP_CONFIG = {
    name: 'Pharmacy LMS Admin',
    version: '1.0.0',
    pageSize: 20,
} as const;

// Permissions
export const PERMISSIONS = {
    // Users
    USERS_VIEW: 'users:view',
    USERS_CREATE: 'users:create',
    USERS_EDIT: 'users:edit',
    USERS_DELETE: 'users:delete',

    // Courses
    COURSES_VIEW: 'courses:view',
    COURSES_CREATE: 'courses:create',
    COURSES_EDIT: 'courses:edit',
    COURSES_DELETE: 'courses:delete',

    // Payments
    PAYMENTS_VIEW: 'payments:view',
    PAYMENTS_MANAGE: 'payments:manage',

    // Settings
    SETTINGS_VIEW: 'settings:view',
    SETTINGS_EDIT: 'settings:edit',
} as const;

// Routes
export const ROUTES = {
    DASHBOARD: '/',
    USERS: '/users',
    USERS_PHARMACISTS: '/users/pharmacists',
    COURSES: '/courses',
    COURSES_ADD: '/courses/add',
    COURSES_CATEGORIES: '/courses/categories',
    PAYMENTS: '/payments/transactions',
    PAYMENTS_COUPONS: '/payments/coupons',
    PAYMENTS_REPORTS: '/payments/reports',
    CE_CREDITS: '/cpe-credits',
    SUPPORT: '/support/announcements',
    SUPPORT_FAQ: '/support/faq',
    SETTINGS: '/settings/general',
    AUDIT_LOGS: '/audit-logs',
} as const;
