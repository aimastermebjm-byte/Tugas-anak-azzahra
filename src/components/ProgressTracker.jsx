import React from 'react';

const ProgressTracker = ({ completedTasks, totalTasks, totalPoints }) => {
  const progressPercentage = (completedTasks.length / totalTasks) * 100;
  const level = Math.floor(totalPoints / 100) + 1;
  const pointsToNextLevel = (level * 100) - totalPoints;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Progress */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-3">
            <span className="text-2xl font-bold">Lv.{level}</span>
          </div>
          <h3 className="font-bold text-purple-800 mb-1">Level Anak Sholeh</h3>
          <p className="text-sm text-gray-600">{pointsToNextLevel} poin lagi naik level!</p>
        </div>

        {/* Daily Progress */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-3">
            <svg className="transform -rotate-90 w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(progressPercentage / 100) * 226} 226`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-lg font-bold text-purple-800">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <h3 className="font-bold text-purple-800 mb-1">Progress Hari Ini</h3>
          <p className="text-sm text-gray-600">{completedTasks.length} dari {totalTasks} tugas</p>
        </div>

        {/* Total Points */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-3 animate-pulse-slow">
            <span className="text-2xl font-bold">{totalPoints}</span>
          </div>
          <h3 className="font-bold text-purple-800 mb-1">Total Poin</h3>
          <p className="text-sm text-gray-600">Masya Allah, hebat!</p>
        </div>
      </div>

      {/* Achievement Banner */}
      {progressPercentage === 100 && (
        <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-center animate-bounce-slow">
          <p className="text-white font-bold text-lg">🎉 SEMUA TUGAS SELESAI! 🎉</p>
          <p className="text-white/90">Masya Allah, anak sholeh banget!</p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;