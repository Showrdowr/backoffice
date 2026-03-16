interface CECreditsSectionProps {
    ceEnabled: boolean;
    onCeEnabledChange: (enabled: boolean) => void;
}

export function CECreditsSection({ ceEnabled, onCeEnabledChange }: CECreditsSectionProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100">
            <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100 rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-800">CPE Credit</h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="ceEnable"
                        checked={ceEnabled}
                        onChange={(e) => onCeEnabledChange(e.target.checked)}
                        className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="ceEnable" className="text-sm font-semibold text-slate-700">
                        เปิดใช้งาน CPE Credit
                    </label>
                </div>
                {ceEnabled && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">จำนวน CPE Credit</label>
                            <input
                                type="number"
                                min={0}
                                max={20}
                                step={0.5}
                                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Conference Code</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                placeholder="Conference Code"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
