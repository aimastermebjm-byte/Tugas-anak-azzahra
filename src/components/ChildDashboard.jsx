import React, { useState, useEffect } from 'react';
import { dailyTasks, rewards, motivations } from '../utils/tasksData.js';
import TaskCard from './TaskCard';
import RewardSection from './RewardSection';
import ProgressTracker from './ProgressTracker';
import DailySummary from './DailySummary';
import { authService } from '../firebase/authService';

const ChildDashboard = ({ user, userData, onLogout }) => {
  const [currentTasks, setCurrentTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState('');

  useEffect(() => {
    // Load saved data from localStorage
    const savedCompleted = localStorage.getItem(`completedTasks_${user.uid}`);
    const savedPoints = localStorage.getItem(`totalPoints_${user.uid}`);

    if (savedCompleted) {
      setCompletedTasks(JSON.parse(savedCompleted));
    }
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints));
    }

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [user.uid]);

  useEffect(() => {
    // Get current time slot
    const hour = currentTime.getHours();
    const currentSlot = dailyTasks.find(slot => {
      const slotHour = parseInt(slot.time.split(':')[0]);
      return hour >= slotHour && hour < slotHour + 3;
    });

    if (currentSlot) {
      setCurrentTasks([currentSlot]);
    } else {
      // Show all tasks for today
      setCurrentTasks(dailyTasks);
    }
  }, [currentTime]);

  const handleTaskComplete = (taskId, points) => {
    if (!completedTasks.includes(taskId)) {
      const newCompleted = [...completedTasks, taskId];
      const newPoints = totalPoints + points;

      setCompletedTasks(newCompleted);
      setTotalPoints(newPoints);

      // Save to localStorage dengan user-specific key
      localStorage.setItem(`completedTasks_${user.uid}`, JSON.stringify(newCompleted));
      localStorage.setItem(`totalPoints_${user.uid}`, newPoints.toString());

      // Show motivation
      const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
      setCurrentMotivation(randomMotivation);
      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
  };

  const handleResetDaily = () => {
    setCompletedTasks([]);
    setTotalPoints(0);
    localStorage.removeItem(`completedTasks_${user.uid}`);
    localStorage.removeItem(`totalPoints_${user.uid}`);
  };

  return (
    <div className="min-h-screen kid-pattern stars-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🕌</div>
              <div>
                <h1 className="text-2xl font-bold text-purple-800">Dashboard Anak</h1>
                <p className="text-sm text-purple-600">
                  Selamat datang, {userData?.name || user.email}! 👋
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-lg font-semibold text-purple-800">
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-purple-600">
                  {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Tracker */}
        <ProgressTracker
          completedTasks={completedTasks}
          totalTasks={dailyTasks.flatMap(slot => slot.tasks).length}
          totalPoints={totalPoints}
        />

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-3xl p-8 shadow-2xl animate-bounce-slow">
              <div className="text-6xl text-center mb-4">🎉</div>
              <p className="text-xl font-bold text-purple-800 text-center">{currentMotivation}</p>
            </div>
          </div>
        )}

        {/* Current Tasks */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">📋</span>
            Tugas Hari Ini
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentTasks.map((timeSlot) => (
              <TaskCard
                key={timeSlot.id}
                timeSlot={timeSlot}
                completedTasks={completedTasks}
                onTaskComplete={handleTaskComplete}
              />
            ))}
          </div>
        </section>

        {/* Daily Summary */}
        <DailySummary
          completedTasks={completedTasks}
          allTasks={dailyTasks}
          onReset={handleResetDaily}
        />

        {/* Rewards Section */}
        <RewardSection
          rewards={rewards}
          currentPoints={totalPoints}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm mt-16 py-6">
        <div className="text-center">
          <p className="text-purple-800 font-semibold">
            "Wahai anak-anak, sholatlah kamu pada umur 7 tahun"
          </p>
          <p className="text-purple-600 text-sm mt-2">
            (HR. Abu Dawud)
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="text-2xl">🌙</span>
            <span className="text-2xl">⭐</span>
            <span className="text-2xl">🕌</span>
            <span className="text-2xl">💫</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChildDashboard;