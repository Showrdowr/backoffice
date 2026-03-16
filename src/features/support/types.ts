// Support Feature Types

export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
    isPublished: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isPublished: boolean;
}

export interface SupportTicket {
    id: string;
    userId: string;
    userName: string;
    subject: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    resolvedAt?: string;
}
