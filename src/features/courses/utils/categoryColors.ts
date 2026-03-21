const CATEGORY_COLOR_CLASS_MAP: Record<string, { iconBg: string; hero: string }> = {
    blue: {
        iconBg: 'bg-blue-500',
        hero: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    rose: {
        iconBg: 'bg-rose-500',
        hero: 'bg-gradient-to-br from-rose-500 to-rose-600',
    },
    emerald: {
        iconBg: 'bg-emerald-500',
        hero: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    violet: {
        iconBg: 'bg-violet-500',
        hero: 'bg-gradient-to-br from-violet-500 to-violet-600',
    },
    amber: {
        iconBg: 'bg-amber-500',
        hero: 'bg-gradient-to-br from-amber-500 to-amber-600',
    },
    cyan: {
        iconBg: 'bg-cyan-500',
        hero: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    },
    pink: {
        iconBg: 'bg-pink-500',
        hero: 'bg-gradient-to-br from-pink-500 to-pink-600',
    },
    slate: {
        iconBg: 'bg-slate-500',
        hero: 'bg-gradient-to-br from-slate-500 to-slate-600',
    },
};

const DEFAULT_CATEGORY_COLOR_CLASSES = CATEGORY_COLOR_CLASS_MAP.violet;

export function getCategoryColorClasses(color?: string | null) {
    if (!color) {
        return DEFAULT_CATEGORY_COLOR_CLASSES;
    }

    return CATEGORY_COLOR_CLASS_MAP[color] || DEFAULT_CATEGORY_COLOR_CLASSES;
}
