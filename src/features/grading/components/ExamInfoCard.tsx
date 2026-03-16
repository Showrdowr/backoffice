interface ExamInfoCardProps {
  title: string;
  totalScore: number;
  passingScorePercent: number;
}

export function ExamInfoCard({ title, totalScore, passingScorePercent }: ExamInfoCardProps) {
  const passingScore = (totalScore * passingScorePercent) / 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        📝 ข้อมูลข้อสอบ
      </h2>
      <div className="space-y-2">
        <div>
          <span className="text-gray-600">ชื่อข้อสอบ:</span>
          <p className="font-medium text-gray-900 mt-1">{title}</p>
        </div>
        <div className="flex gap-8 mt-4">
          <div>
            <span className="text-gray-600">คะแนนเต็ม:</span>
            <p className="font-bold text-2xl text-blue-600">{totalScore}</p>
          </div>
          <div>
            <span className="text-gray-600">เกณฑ์ผ่าน:</span>
            <p className="font-bold text-2xl text-green-600">
              {passingScorePercent}% ({passingScore} คะแนน)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
