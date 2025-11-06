import React from 'react';

const RewardSection = ({ rewards, currentPoints }) => {
  return (
    <section className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
        <span className="mr-3">🏆</span>
        Hadiah & Penghargaan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => {
          const isUnlocked = currentPoints >= reward.points;
          const progress = Math.min((currentPoints / reward.points) * 100, 100);

          return (
            <div
              key={reward.id}
              className={`task-card ${
                isUnlocked
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-5xl animate-wiggle">{reward.icon}</div>
                {isUnlocked && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                    Terbuka!
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
              <p className="text-sm mb-4 opacity-90">{reward.description}</p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{currentPoints} / {reward.points} poin</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-white'
                        : 'bg-gradient-to-r from-blue-400 to-purple-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {isUnlocked && (
                <button className="w-full mt-4 bg-white text-orange-500 px-4 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
                  Klaim Hadiah 🎁
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Motivational Message */}
      <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center">
        <p className="text-lg font-bold text-purple-800 mb-2">
          💫 "Hai anak-anak, jika kamu mampu sholat, maka sholatlah."
        </p>
        <p className="text-purple-600">
          - Hadis Riwayat Abu Dawud -
        </p>
        <p className="text-sm text-purple-600 mt-2">
          Setiap tugas yang kamu kerjakan adalah investasi untuk akhiratmu! 🌟
        </p>
      </div>
    </section>
  );
};

export default RewardSection;