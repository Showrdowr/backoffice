// Shared UI Components - Table
import React from 'react';

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
}

export default function Table<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = 'ไม่พบข้อมูล',
}: TableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className={`text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={keyExtractor(item)} className="hover:bg-slate-50">
                                {columns.map((col) => (
                                    <td key={String(col.key)} className={`px-6 py-4 ${col.className || ''}`}>
                                        {col.render
                                            ? col.render(item)
                                            : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
