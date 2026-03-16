// Settings Feature Types

export interface GeneralSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    timezone: string;
}

export interface EmailSettings {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpSecure: boolean;
    senderName: string;
    senderEmail: string;
}

export interface PaymentSettings {
    enableCreditCard: boolean;
    enablePromptPay: boolean;
    enableBankTransfer: boolean;
    vatRate: number;
}

export interface SecuritySettings {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireMfa: boolean;
    passwordMinLength: number;
}

export interface Admin {
    id: string;
    email: string;
    name: string;
    role: 'super_admin' | 'admin' | 'moderator';
    lastLogin?: string;
    isActive: boolean;
}
