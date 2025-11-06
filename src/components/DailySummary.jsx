import React from 'react';

const DailySummary = ({ completedTasks, allTasks, onReset }) => {
  const totalCompletedTasks = completedTasks.length;
  const totalTasksCount = allTasks.flatMap(slot => slot.tasks).length;
  const completionPercentage = (totalCompletedTasks / totalTasksCount) * 100;

  const getMotivationalMessage = () => {
    if (completionPercentage === 100) {
      return {
        emoji: "🏆",
        title: "Masya Allah! Sempurna!",
        message: "Hari ini kamu sudah menyelesaikan semua tugas. Allah pasti senang dengan kamu!"
      };
    } else if (completionPercentage >= 80) {
      return {
        emoji: "🌟",
        title: "Luar Biasa!",
        message: "Kamu sudah hampir sempurna! Tetap semangat ya!"
      };
    } else if (completionPercentage >= 60) {
      return {
        emoji: "💪",
        title: "Hebat Sekali!",
        message: "Kemajuan yang bagus! Teruskan usahamu!"
      };
    } else if (completionPercentage >= 40) {
      return {
        emoji: "👍",
        title: "Bagus!",
        message: "Lanjutkan lagi, kamu pasti bisa!"
      };
    } else if (completionPercentage > 0) {
      return {
        emoji: "🌱",
        title: "Mulai Hebat!",
        message: "Bagus sudah memulai. Teruskan perjuangannya!"
      };
    } else {
      return {
        emoji: "🚀",
        title: "Ayo Mulai!",
        message: "Yuk, mulai tugas pertamamu hari ini!"
      };
    }
  };

  const motivational = getMotivationalMessage();

  // Categorize completed tasks by time
  const getCompletedByTime = () => {
    const timeSlots = {};
    allTasks.forEach(slot => {
      const completedInSlot = slot.tasks.filter(task => completedTasks.includes(task.id));
      if (completedInSlot.length > 0) {
        timeSlots[slot.timeLabel] = {
          completed: completedInSlot.length,
          total: slot.tasks.length,
          icon: slot.icon
        };
      }
    });
    return timeSlots;
  };

  const completedByTime = getCompletedByTime();

  return (
    <section className="mb-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        {/* Main Summary */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-slow">{motivational.emoji}</div>
          <h2 className="text-3xl font-bold text-purple-800 mb-2">{motivational.title}</h2>
          <p className="text-lg text-purple-600">{motivational.message}</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-kid-blue/10 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-kid-blue">{totalCompletedTasks}</p>
            <p className="text-sm text-gray-600">Tugas Selesai</p>
          </div>
          <div className="bg-kid-green/10 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-kid-green">{totalTasksCount - totalCompletedTasks}</p>
            <p className="text-sm text-gray-600">Tugas Tersisa</p>
          </div>
          <div className="bg-kid-yellow/10 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-kid-yellow">{Math.round(completionPercentage)}%</p>
            <p className="text-sm text-gray-600">Progress</p>
          </div>
          <div className="bg-kid-purple/10 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-kid-purple">{Object.keys(completedByTime).length}</p>
            <p className="text-sm text-gray-600">Waktu Selesai</p>
          </div>
        </div>

        {/* Completed Time Slots */}
        {Object.keys(completedByTime).length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-purple-800 mb-4">Waktu Yang Sudah Diselesaikan:</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(completedByTime).map(([timeLabel, data]) => (
                <div
                  key={timeLabel}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
                >
                  <span className="text-xl">{data.icon}</span>
                  <span className="font-semibold">{timeLabel}</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                    {data.completed}/{data.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-semibold text-purple-800 mb-2">
            <span>Progress Keseluruhan Hari Ini</span>
            <span>{totalCompletedTasks} dari {totalTasksCount} tugas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Reset Button (for parents) */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold transition-colors duration-300"
          >
            🔄 Reset Harian (Untuk Orang Tua)
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Tombol ini akan menghapus semua progress hari ini
          </p>
        </div>
      </div>
    </section>
  );
};

export default DailySummary;