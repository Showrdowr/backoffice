interface ScoreSummaryCardProps {
  currentScore: number;
  totalScore: number;
  passingScorePercent: number;
  isPassed?: boolean;
}

export function ScoreSummaryCard({
  currentScore,
  totalScore,
  passingScorePercent,
  isPassed
}: ScoreSummaryCardProps) {
  const passingScore = (totalScore * passingScorePercent) / 100;
  const percentage = totalScore > 0 ? ((currentScore / totalScore) * 100).toFixed(2) : 0;
  
  const willPass = currentScore >= passingScore;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        📊 สรุปคะแนน
      </h2>
      
      <div className="space-y-4">
        {/* Score Display */}
        <div className="flex items-end justify-center gap-2">
          <span className="text-5xl font-bold text-blue-600">{currentScore}</span>
          <span className="text-2xl text-gray-500 pb-2">/ {totalScore}</span>
        </div>

        {/* Percentage */}
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-700">{percentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              willPass ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.min(Number(percentage), 100)}%` }}
          ></div>
        </div>

        {/* Pass/Fail Status */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">เกณฑ์ผ่าน:</span>
            <span className="font-semibold">{passingScore} คะแนน ({passingScorePercent}%)</span>
          </div>
          
          <div className="mt-3 p-4 rounded-lg text-center">
            {willPass ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 font-bold text-lg">✓ ผ่าน</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 font-bold text-lg">✗ ไม่ผ่าน</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
