import {
    Users,
    BookOpen,
    CreditCard,
    Award,
    ArrowUpRight,
    ArrowDownRight,
    type LucideIcon,
} from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    change: number;
    icon: LucideIcon;
    color: string;
}

export function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
    const isPositive = change >= 0;

    return (
        <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-sky-100 overflow-hidden group card-hover">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon size={28} className="text-white" />
                    </div>
                    <span className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full ${isPositive
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-red-600 bg-red-50'
                        }`}>
                        {isPositive ? (
                            <ArrowUpRight size={16} />
                        ) : (
                            <ArrowDownRight size={16} />
                        )}
                        {Math.abs(change)}%
                    </span>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
                    <p className="text-sm text-slate-500 font-medium">{title}</p>
                </div>
            </div>
        </div>
    );
}

export function getStatIcon(type: string): LucideIcon {
    switch (type) {
        case 'users': return Users;
        case 'courses': return BookOpen;
        case 'revenue': return CreditCard;
        case 'cpeCredits': return Award;
        default: return Users;
    }
}

export function getStatColor(type: string): string {
    switch (type) {
        case 'users': return 'bg-blue-500';
        case 'courses': return 'bg-emerald-500';
        case 'revenue': return 'bg-violet-500';
        case 'cpeCredits': return 'bg-amber-500';
        default: return 'bg-gray-500';
    }
}
