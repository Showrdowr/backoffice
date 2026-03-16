import { Plus, Edit, Trash2, HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
    { id: 1, question: 'วิธีการชำระเงินมีอะไรบ้าง?', answer: 'รองรับ PromptPay และ Credit Card', category: 'การชำระเงิน' },
    { id: 2, question: 'CPE Credit ใช้เวลากี่วันในการอนุมัติ?', answer: 'ภายใน 3 วันทำการ', category: 'CPE Credit' },
    { id: 3, question: 'สามารถเรียนซ้ำได้หรือไม่?', answer: 'ได้ ไม่จำกัดจำนวนครั้ง', category: 'คอร์สเรียน' },
    { id: 4, question: 'ติดต่อฝ่ายสนับสนุนได้อย่างไร?', answer: 'ติดต่อผ่านอีเมล support@pharmacylms.com', category: 'ทั่วไป' },
];

export default function FAQPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">จัดการ FAQ</h1>
                    <p className="text-slate-500">จัดการคำถามที่พบบ่อย</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Plus size={18} />
                    <span>เพิ่ม FAQ</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="divide-y divide-slate-100">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <HelpCircle size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{faq.question}</p>
                                        <p className="text-sm text-slate-500 mt-1">{faq.answer}</p>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                                            {faq.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit size={16} className="text-slate-500" /></button>
                                    <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
