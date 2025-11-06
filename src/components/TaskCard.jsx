import React from 'react';

const TaskCard = ({ timeSlot, completedTasks, onTaskComplete }) => {
  const getCardColor = (category) => {
    const colors = {
      ibadah: 'from-purple-400 to-purple-600',
      pendidikan: 'from-blue-400 to-blue-600',
      kebersihan: 'from-green-400 to-green-600',
    };
    return colors[category] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className={`task-card bg-gradient-to-br ${getCardColor(timeSlot.category)} text-white`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-4xl animate-pulse-slow">{timeSlot.icon}</div>
          <div>
            <h3 className="text-xl font-bold">{timeSlot.timeLabel}</h3>
            <p className="text-white/80 text-sm">{timeSlot.time}</p>
          </div>
        </div>
        <div className="reward-badge">
          {timeSlot.tasks.reduce((sum, task) => sum + task.points, 0)}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {timeSlot.tasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id);
          return (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                isCompleted
                  ? 'bg-white/20 backdrop-blur-sm line-through opacity-60'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{task.icon}</span>
                <div>
                  <p className="font-medium">{task.name}</p>
                  <p className="text-xs text-white/80">+{task.points} poin</p>
                </div>
              </div>

              <button
                onClick={() => onTaskComplete(task.id, task.points)}
                disabled={isCompleted}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-white/30 hover:bg-white/50 text-white hover:scale-105'
                }`}
              >
                {isCompleted ? (
                  <span className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Selesai</span>
                  </span>
                ) : (
                  <span>Kerjakan</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>
            {timeSlot.tasks.filter(task => completedTasks.includes(task.id)).length} / {timeSlot.tasks.length}
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
            style={{
              width: `${(timeSlot.tasks.filter(task => completedTasks.includes(task.id)).length / timeSlot.tasks.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;