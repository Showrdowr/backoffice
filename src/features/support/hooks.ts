// Support Feature Hooks
import { useState, useCallback } from 'react';
import type { Announcement, FAQ } from './types';

export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            // TODO: Implement API call
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { announcements, loading, fetchAnnouncements };
}

export function useFAQs() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFAQs = useCallback(async () => {
        setLoading(true);
        try {
            // TODO: Implement API call
            setFaqs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { faqs, loading, fetchFAQs };
}
