# 🏥 Pharmacy Academy - ระบบ Back Office

ระบบจัดการหลังบ้านสำหรับ Pharmacy Academy (สำนักงานเภสัชกรรม) พัฒนาด้วย Next.js 16 และ TypeScript

## 📋 ภาพรวมระบบ

ระบบ Back Office นี้เป็นเครื่องมือสำหรับผู้ดูแลระบบในการจัดการคอร์สเรียน ผู้ใช้งาน การชำระเงิน และฟีเจอร์ต่างๆ ของ Pharmacy Academy

### ฟีเจอร์หลัก

- 📊 **Dashboard** - แดชบอร์ดแสดงภาพรวมข้อมูลสำคัญ
- 👥 **จัดการผู้ใช้** - จัดการข้อมูลสมาชิก เภสัชกร และผู้ดูแลระบบ
- 📚 **จัดการคอร์ส** - สร้างและจัดการหมวดหมู่คอร์ส บทเรียน และเนื้อหา
- 🎥 **จัดการวิดีโอ** - อัปโหลดและจัดการวิดีโอบทเรียน
- 📝 **ระบบการให้คะแนน** - จัดการการตรวจข้อสอบและให้คะแนน
- 💳 **จัดการการชำระเงิน** - ติดตามและอนุมัติการชำระเงิน
- 🎓 **หน่วยกิต CPE** - จัดการหน่วยกิตต่อเนื่องสำหรับเภสัชกร
- 📄 **ใบรับรองและใบกำกับภาษี** - สร้างและจัดการเอกสารต่างๆ
- 💬 **ระบบสนับสนุน** - จัดการคำถามและคำร้องเรียนจากผู้ใช้
- 📋 **บันทึกการตรวจสอบ** - ติดตามประวัติการทำงานในระบบ
- ⚙️ **การตั้งค่า** - จัดการการตั้งค่าระบบต่างๆ

## 🚀 เริ่มต้นใช้งาน

### ข้อกำหนด

- Node.js 20 หรือสูงกว่า
- npm, yarn, pnpm หรือ bun

### การติดตั้ง

1. ติดตั้ง dependencies:

```bash
npm install
```

2. รันเซิร์ฟเวอร์สำหรับพัฒนา:

```bash
npm run dev
```

3. เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### คำสั่งที่มี

```bash
npm run dev      # รันเซิร์ฟเวอร์พัฒนา
npm run build    # สร้าง production build
npm run start    # รัน production server
npm run lint     # ตรวจสอบโค้ดด้วย ESLint
```

## 🏗️ โครงสร้างโปรเจ็กต์

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # หน้าเว็บสำหรับผู้ดูแลระบบ
│   ├── (auth)/            # หน้าเข้าสู่ระบบ
│   ├── globals.css        # CSS ทั่วทั้งแอป
│   └── layout.tsx         # Layout หลัก
├── components/            # คอมโพเนนต์ที่ใช้ร่วมกัน
│   ├── layout/           # Layout components (Sidebar, Header, etc.)
│   └── ui/               # UI components (Button, Modal, etc.)
├── features/             # ฟีเจอร์ต่างๆ ของแอป
│   ├── audit-logs/       # บันทึกการตรวจสอบ
│   ├── courses/          # จัดการคอร์ส
│   ├── cpe-credits/      # หน่วยกิต CPE
│   ├── dashboard/        # แดชบอร์ด
│   ├── grading/          # ระบบให้คะแนน
│   ├── payments/         # การชำระเงิน
│   ├── settings/         # การตั้งค่า
│   ├── support/          # ระบบสนับสนุน
│   ├── users/            # จัดการผู้ใช้
│   └── videos/           # จัดการวิดีโอ
├── services/             # Services สำหรับเรียกใช้งาน API
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🛠️ เทคโนโลยีที่ใช้

- **Framework:** Next.js 16.1.0 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19.2.3
- **Styling:** Tailwind CSS 4
- **Components:**
  - Headless UI 2.2.9
  - Lucide React (Icons)
- **Data Visualization:** Recharts 3.6.0
- **Date Handling:** date-fns 4.1.0
- **CSV Parsing:** PapaParse 5.5.3
- **Utilities:** clsx 2.1.1

## 📦 รูปแบบการพัฒนา

โปรเจ็กต์นี้ใช้รูปแบบ **Feature-based Architecture**:

- แต่ละ feature มีโฟลเดอร์ของตัวเองที่รวมทั้ง components, services และ types
- Components ที่ใช้ร่วมกันอยู่ในโฟลเดอร์ `components/`
- ใช้ TypeScript อย่างเข้มงวดเพื่อความปลอดภัยของโค้ด
- ใช้ Tailwind CSS สำหรับการจัดการ styling

## 🔐 การเข้าสู่ระบบ

สำหรับการพัฒนา ระบบมีหน้าเข้าสู่ระบบที่ `/login`

## 📝 หมายเหตุ

- โปรเจ็กต์นี้พัฒนาด้วย Next.js App Router (ไม่ใช่ Pages Router)
- ใช้ Server Components และ Client Components ตามความเหมาะสม
- รองรับการใช้งาน Font แบบ optimized ด้วย `next/font`

## 🤝 การมีส่วนร่วม

โปรเจ็กต์นี้เป็นส่วนหนึ่งของระบบ Pharmacy Academy สำหรับข้อมูลเพิ่มเติม กรุณาติดต่อทีมพัฒนา

## 📄 License

Private Project - All Rights Reserved
