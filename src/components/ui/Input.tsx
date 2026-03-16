// Shared UI Components - Input
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({
    label,
    error,
    className = '',
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 border border-slate-200 rounded-lg
          text-base md:text-sm
          focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
          transition-all duration-200
          min-h-[44px]
          ${error ? 'border-red-500 focus:ring-red-500' : ''} 
          ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

