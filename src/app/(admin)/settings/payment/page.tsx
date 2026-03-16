import { Save, CreditCard, QrCode, Banknote } from 'lucide-react';

export default function PaymentSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">ตั้งค่าการชำระเงิน</h1>
                <p className="text-slate-500">ตั้งค่าช่องทางการรับชำระเงิน</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CreditCard size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">Credit / Debit Card</h2>
                                <p className="text-sm text-slate-500">Stripe / Omise</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Public Key</label>
                            <input type="text" placeholder="pk_live_xxx" className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Secret Key</label>
                            <input type="password" placeholder="sk_live_xxx" className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <QrCode size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">PromptPay QR</h2>
                                <p className="text-sm text-slate-500">พร้อมเพย์</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">หมายเลขพร้อมเพย์</label>
                            <input type="text" defaultValue="0891234567" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">ชื่อบัญชี</label>
                            <input type="text" defaultValue="Pharmacy LMS Co., Ltd." className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Banknote size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">โอนเงินธนาคาร</h2>
                                <p className="text-sm text-slate-500">Bank Transfer</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">ธนาคาร</label>
                            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                                <option>ธนาคารกสิกรไทย</option>
                                <option>ธนาคารไทยพาณิชย์</option>
                                <option>ธนาคารกรุงเทพ</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">เลขบัญชี</label>
                            <input type="text" defaultValue="123-4-56789-0" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    <Save size={18} />
                    <span>บันทึกการตั้งค่า</span>
                </button>
            </div>
        </div>
    );
}
