import React, { useState, useEffect } from 'react';
import { authService } from '../firebase/authService';

const ParentDashboard = ({ user, userData, onLogout }) => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadChildrenData();

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const loadChildrenData = async () => {
    try {
      const childrenData = await authService.getChildrenData(user.email);
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error('Error loading children data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChildProgress = (childId) => {
    const savedCompleted = localStorage.getItem(`completedTasks_${childId}`);
    const savedPoints = localStorage.getItem(`totalPoints_${childId}`);

    return {
      completedTasks: savedCompleted ? JSON.parse(savedCompleted) : [],
      totalPoints: savedPoints ? parseInt(savedPoints) : 0
    };
  };

  const calculateProgressPercentage = (completedTasks, totalTasks) => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks.length / totalTasks) * 100);
  };

  const getChildStatus = (progress) => {
    const percentage = calculateProgressPercentage(progress.completedTasks, 9); // 9 total tasks per day
    if (percentage === 100) return { text: 'Selesai', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 50) return { text: 'Sedang Berjalan', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'Belum Dimulai', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center kid-pattern stars-bg">
        <div className="text-white text-2xl">Memuat data anak-anak...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen kid-pattern stars-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">👨‍👩‍👧‍👦</div>
              <div>
                <h1 className="text-2xl font-bold text-purple-800">Dashboard Orang Tua</h1>
                <p className="text-sm text-purple-600">
                  Halo, {userData?.name || user.email}! 👋
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Children Overview */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">👨‍👩‍👧‍👦</span>
            Progress Anak-Anak
          </h2>

          {children.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600">Belum ada data anak yang terdaftar</p>
              <p className="text-gray-500 mt-2">Pastikan anak-anak sudah login dan mengerjakan tugasnya</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => {
                const progress = getChildProgress(child.email);
                const status = getChildStatus(progress);
                const percentage = calculateProgressPercentage(progress.completedTasks, 9);

                return (
                  <div
                    key={child.id}
                    className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer"
                    onClick={() => setSelectedChild(child)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">👧</div>
                        <div>
                          <h3 className="text-xl font-bold text-purple-800">{child.name}</h3>
                          <p className="text-sm text-purple-600">{child.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress Hari Ini</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-purple-800">{progress.completedTasks.length}</div>
                        <div className="text-xs text-purple-600">Tugas Selesai</div>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-800">{progress.totalPoints}</div>
                        <div className="text-xs text-yellow-600">Poin Didapat</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Selected Child Detail */}
        {selectedChild && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Detail Progress - {selectedChild.name}
            </h2>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Today's Progress */}
                <div>
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Progress Hari Ini</h3>
                  {(() => {
                    const progress = getChildProgress(selectedChild.email);
                    const status = getChildStatus(progress);

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                          <span className="font-semibold text-purple-800">Status</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.bg} ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-xl">
                          <div className="flex justify-between">
                            <span className="font-semibold text-yellow-800">Total Poin</span>
                            <span className="text-2xl font-bold text-yellow-800">{progress.totalPoints}</span>
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                          <div className="flex justify-between">
                            <span className="font-semibold text-green-800">Tugas Selesai</span>
                            <span className="text-2xl font-bold text-green-800">
                              {progress.completedTasks.length} / 9
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Weekly Summary */}
                <div>
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Ringkasan Mingguan</h3>
                  <div className="space-y-3">
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'].map((day, index) => {
                      const date = new Date();
                      date.setDate(date.getDate() - date.getDay() + index + 1);
                      const dateKey = date.toISOString().split('T')[0];
                      const dayProgress = JSON.parse(localStorage.getItem(`completedTasks_${selectedChild.email}_${dateKey}`) || '[]');
                      const dayPercentage = calculateProgressPercentage(dayProgress, 9);

                      return (
                        <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">{day}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${dayPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">{dayPercentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <div className="text-6xl mb-4">💫</div>
          <h3 className="text-2xl font-bold mb-2">Terus Mendukung Anak-Anak!</h3>
          <p className="text-lg opacity-90">
            "Didikanlah anak-anakmu dengan tiga hal: cinta kepada Nabi, cinta kepada Ahlul Bait, dan membaca Al-Quran."
          </p>
          <p className="text-sm opacity-75 mt-2">- (HR. Thabrani)</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm mt-16 py-6">
        <div className="text-center">
          <p className="text-purple-800 font-semibold">
            "Didikan anak-anak sejak usia dini untuk menjadi generasi yang sholeh"
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <span className="text-2xl">🕌</span>
            <span className="text-2xl">📖</span>
            <span className="text-2xl">💕</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ParentDashboard;