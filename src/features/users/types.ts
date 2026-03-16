// Users feature types
export interface User {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    joined: Date;
    courses: number;
}

export interface Pharmacist extends User {
    license: string;
    cpeCredits: number;
    verificationStatus: 'verified' | 'pending' | 'rejected';
}

export interface UserStats {
    total: number;
    active: number;
    inactive: number;
}

export interface PharmacistStats extends UserStats {
    verified: number;
    totalCpeCredits: number;
    averageCpeCredits: number;
}

export interface UsersData {
    users: User[];
    stats: UserStats;
}

export interface PharmacistsData {
    pharmacists: Pharmacist[];
    stats: PharmacistStats;
}
