import React, { useState } from 'react';
import { authService } from '../firebase/authService';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(email, password);
      onLogin(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center kid-pattern stars-bg p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🕌</div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Aplikasi Anak Sholeh</h1>
          <p className="text-purple-600">Tugas Harian Islami</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Masukkan email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Masukkan password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Account Info */}
        <div className="mt-8 p-4 bg-purple-50 rounded-xl">
          <p className="text-sm font-semibold text-purple-800 mb-2">Akun Demo:</p>
          <div className="space-y-2 text-xs text-purple-700">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold">👨‍👩‍👧‍👦 Orang Tua:</p>
                <p>Email: fahrin@example.com</p>
                <p>Password: fahrin123</p>
              </div>
              <div>
                <p className="font-semibold">👧 Anak:</p>
                <p>Email: chayra@example.com</p>
                <p>Password: chayra123</p>
              </div>
            </div>
            <p className="text-center text-purple-600">Dan akun lainnya...</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-purple-600 text-sm">
            "Wahai anak-anak, sholatlah kamu pada umur 7 tahun"
          </p>
          <p className="text-purple-500 text-xs mt-1">
            (HR. Abu Dawud)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;