interface PricingSectionProps {
    courseType: string;
    onCourseTypeChange: (type: string) => void;
}

export function PricingSection({ courseType, onCourseTypeChange }: PricingSectionProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100">
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-800">ราคาและการเข้าถึง</h2>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">ประเภทคอร์ส</label>
                    <select
                        value={courseType}
                        onChange={(e) => onCourseTypeChange(e.target.value)}
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all bg-white"
                    >
                        <option value="paid">มีค่าใช้จ่าย</option>
                        <option value="free">ฟรี</option>
                    </select>
                </div>
                {courseType === 'paid' && (
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            ราคา (บาท) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            placeholder="0"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">ระยะเวลาเข้าถึง</label>
                    <select className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all bg-white">
                        <option value="lifetime">ตลอดชีพ</option>
                        <option value="1year">1 ปี</option>
                        <option value="6months">6 เดือน</option>
                        <option value="3months">3 เดือน</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
