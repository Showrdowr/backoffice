export function parseDbDate(dateInput?: string | Date | null): Date {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) return dateInput;
    
    // If it's a raw SQL timestamp without timezone info (e.g. "2026-03-13 06:39:00")
    // convert it to a valid ISO string and append 'Z' to treat it as UTC.
    // The browser will then correctly convert it to the user's local timezone (UTC+7).
    if (typeof dateInput === 'string' && !dateInput.includes('T') && !dateInput.endsWith('Z')) {
        return new Date(dateInput.replace(' ', 'T') + 'Z');
    }
    
    return new Date(dateInput);
}
