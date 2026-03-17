'use client';

import { Check } from 'lucide-react';

export interface Step {
    id: number;
    title: string;
    subtitle?: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (stepId: number) => void;
    canNavigateTo?: (stepId: number) => boolean;
}

export function StepIndicator({ steps, currentStep, onStepClick, canNavigateTo }: StepIndicatorProps) {
    return (
        <div className="flex items-center w-full">
            {steps.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;
                const isPending = step.id > currentStep;
                const isLast = index === steps.length - 1;
                const canClick = canNavigateTo ? canNavigateTo(step.id) : isCompleted || isActive;

                return (
                    <div key={step.id} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
                        {/* Circle + Label */}
                        <button
                            type="button"
                            onClick={() => canClick && onStepClick?.(step.id)}
                            disabled={!canClick}
                            className="flex flex-col items-center gap-1.5 group"
                        >
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                    ${isCompleted
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                                        : isActive
                                            ? 'bg-sky-500 text-white shadow-md shadow-sky-200 ring-4 ring-sky-100'
                                            : 'bg-slate-200 text-slate-500'
                                    }
                                    ${canClick && !isActive ? 'cursor-pointer group-hover:scale-110' : ''}
                                    ${!canClick ? 'cursor-not-allowed' : ''}
                                `}
                            >
                                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
                            </div>
                            <div className="text-center min-w-[80px]">
                                <p className={`text-xs font-semibold leading-tight
                                    ${isActive ? 'text-sky-700' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}
                                `}>
                                    {step.title}
                                </p>
                            </div>
                        </button>

                        {/* Connector Line */}
                        {!isLast && (
                            <div className="flex-1 mx-2 mt-[-20px]">
                                <div className={`h-0.5 rounded-full transition-all ${
                                    isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                                }`} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
