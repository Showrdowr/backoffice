interface PricingSectionProps {
    courseType: string;
    onCourseTypeChange: (type: string) => void;
    price?: number;
    onPriceChange?: (price: number) => void;
}

export function PricingSection({ courseType, onCourseTypeChange, price = 0, onPriceChange }: PricingSectionProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100">
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-800">ราคาและการเข้าถึง</h2>
                <p className="mt-1 text-sm text-slate-500">
                    กำหนดว่าคอร์สนี้เป็นคอร์สฟรีหรือมีค่าใช้จ่าย ข้อมูลนี้จะใช้แสดงบนการ์ดคอร์สและหน้า Course Details
                </p>
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
                        <p className="mb-2 text-xs text-slate-500">
                            ระบุราคาที่ผู้เรียนต้องชำระก่อนเข้าเรียน หากต้องการให้เข้าเรียนได้ทันทีให้เลือกคอร์สฟรี
                        </p>
                        <input
                            type="number"
                            min={0}
                            value={price}
                            onChange={(e) => onPriceChange?.(Number(e.target.value) || 0)}
                            className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            placeholder="0"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
