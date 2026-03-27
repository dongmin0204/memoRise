import React from 'react'

interface StudyResultProps {
  memorized: number
  unknown: number
  total: number
  onRestart: () => void
  onGoHome: () => void
}

const StudyResult: React.FC<StudyResultProps> = ({
  memorized,
  unknown,
  total,
  onRestart,
  onGoHome,
}) => {
  const percentage = total > 0 ? Math.round((memorized / total) * 100) : 0

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto py-8">
      <div className="w-full rounded-2xl border border-gray-200 bg-[#f7f3e8] p-6 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-gray-800">학습 완료!</h2>

      <div className="w-32 h-32 rounded-full border-8 border-indigo-500 flex items-center justify-center bg-white/60">
        <span className="text-3xl font-bold text-indigo-600">{percentage}%</span>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full text-center">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-emerald-600">{memorized}</p>
          <p className="text-sm text-emerald-700">암기</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-rose-600">{unknown}</p>
          <p className="text-sm text-rose-700">미암기</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-600">{total}</p>
          <p className="text-sm text-gray-700">전체</p>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={onRestart}
          className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 active:scale-95 transition-all"
        >
          다시 학습
        </button>
        <button
          onClick={onGoHome}
          className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 active:scale-95 transition-all"
        >
          홈으로
        </button>
      </div>
      </div>
    </div>
  )
}

export default StudyResult
