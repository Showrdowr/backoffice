interface StudentInfoCardProps {
  fullName: string;
  email: string;
  licenseNumber?: string;
}

export function StudentInfoCard({ fullName, email, licenseNumber }: StudentInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        👤 ข้อมูลผู้เรียน
      </h2>
      <div className="space-y-2">
        <div className="flex">
          <span className="text-gray-600 w-32">ชื่อ-นามสกุล:</span>
          <span className="font-medium text-gray-900">{fullName}</span>
        </div>
        <div className="flex">
          <span className="text-gray-600 w-32">อีเมล:</span>
          <span className="text-gray-900">{email}</span>
        </div>
        {licenseNumber && (
          <div className="flex">
            <span className="text-gray-600 w-32">เลขใบอนุญาต:</span>
            <span className="font-medium text-blue-600">{licenseNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
}
