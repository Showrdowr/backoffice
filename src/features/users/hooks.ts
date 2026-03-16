'use client';

import { useState, useEffect } from 'react';
import { userService } from './services/userService';
import type { User, UserStats, Pharmacist, PharmacistStats } from './types';

export function useUsers(page: number = 1, limit: number = 20, search?: string, status?: 'active' | 'inactive') {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                setError(null); // Clear previous errors
                const data = await userService.getUsers(page, limit, search, status);
                setUsers(data.users);
                setStats(data.stats);
            } catch (err) {
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [page, limit, search, status]);

    const refreshUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getUsers(page, limit);
            setUsers(data.users);
            setStats(data.stats);
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        stats,
        isLoading: loading,
        error,
        refresh: refreshUsers,
    };
}

export function usePharmacists(page: number = 1, limit: number = 20, search?: string, status?: 'active' | 'inactive') {
    const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
    const [stats, setStats] = useState<PharmacistStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPharmacists() {
            try {
                setLoading(true);
                setError(null); // Clear previous errors
                const data = await userService.getPharmacists(page, limit, search, status);
                setPharmacists(data.pharmacists);
                setStats(data.stats);
            } catch (err) {
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPharmacists();
    }, [page, limit, search, status]);

    const refreshPharmacists = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getPharmacists(page, limit);
            setPharmacists(data.pharmacists);
            setStats(data.stats);
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        pharmacists,
        stats,
        isLoading: loading,
        error,
        refresh: refreshPharmacists,
    };
}
