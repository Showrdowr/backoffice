export interface AuditLog {
    id: string;
    adminId: string;
    action: string;
    targetTable?: string;
    targetId?: string | null;
    oldValue?: unknown;
    newValue?: unknown;
    ipAddress?: string;
    createAt: string;
    admin?: {
        username: string;
        email: string;
    };
}

export interface AuditLogQueryParams {
    page?: number;
    limit?: number;
    adminId?: string;
    action?: string;
    targetTable?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface PaginatedAuditLogs {
    data: AuditLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


