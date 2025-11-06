import React, { useState, useEffect } from 'react';
import { dailyTasks, rewards, motivations } from './utils/tasksData.js';
import TaskCard from './components/TaskCard';
import RewardSection from './components/RewardSection';
import ProgressTracker from './components/ProgressTracker';
import DailySummary from './components/DailySummary';
import { taskService, progressService } from './firebase/taskService';

function App() {
  const [currentTasks, setCurrentTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState('');

  useEffect(() => {
    // Load saved data from localStorage (temporary until Firebase is properly configured)
    const loadSavedData = async () => {
      try {
        // For now, just use localStorage
        const savedCompleted = localStorage.getItem('completedTasks');
        const savedPoints = localStorage.getItem('totalPoints');

        if (savedCompleted) {
          setCompletedTasks(JSON.parse(savedCompleted));
        }
        if (savedPoints) {
          setTotalPoints(parseInt(savedPoints));
        }

        // Try Firestore but don't fail if it doesn't work
        try {
          const today = new Date().toISOString().split('T')[0];
          const progressData = await progressService.getDailyProgress(today);

          if (progressData) {
            setCompletedTasks(progressData.completedTasks || []);
            setTotalPoints(progressData.totalPoints || 0);
          }
        } catch (firestoreError) {
          console.log('Firestore not configured yet, using localStorage only');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Always fallback to localStorage
        const savedCompleted = localStorage.getItem('completedTasks');
        const savedPoints = localStorage.getItem('totalPoints');

        if (savedCompleted) {
          setCompletedTasks(JSON.parse(savedCompleted));
        }
        if (savedPoints) {
          setTotalPoints(parseInt(savedPoints));
        }
      }
    };

    loadSavedData();

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  const handleTaskComplete = async (taskId, points) => {
    if (!completedTasks.includes(taskId)) {
      const newCompleted = [...completedTasks, taskId];
      const newPoints = totalPoints + points;

      setCompletedTasks(newCompleted);
      setTotalPoints(newPoints);

      // Save to Firestore
      try {
        const progressData = {
          completedTasks: newCompleted,
          totalPoints: newPoints,
          date: new Date().toISOString().split('T')[0]
        };
        await progressService.saveProgress(progressData);
      } catch (error) {
        console.error('Error saving progress to Firestore:', error);
        // Fallback to localStorage
        localStorage.setItem('completedTasks', JSON.stringify(newCompleted));
        localStorage.setItem('totalPoints', newPoints.toString());
      }

      // Show motivation
      const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
      setCurrentMotivation(randomMotivation);
      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
  };

  const handleResetDaily = async () => {
    const newCompleted = [];
    const newPoints = 0;

    setCompletedTasks(newCompleted);
    setTotalPoints(newPoints);

    // Save to Firestore
    try {
      const progressData = {
        completedTasks: newCompleted,
        totalPoints: newPoints,
        date: new Date().toISOString().split('T')[0]
      };
      await progressService.saveProgress(progressData);
    } catch (error) {
      console.error('Error resetting progress to Firestore:', error);
      // Fallback to localStorage
      localStorage.removeItem('completedTasks');
      localStorage.removeItem('totalPoints');
    }
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
                <h1 className="text-2xl font-bold text-purple-800">Aplikasi Anak Sholeh</h1>
                <p className="text-sm text-purple-600">Tugas Harian Islami</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-purple-800">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-sm text-purple-600">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
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
}

export default App;