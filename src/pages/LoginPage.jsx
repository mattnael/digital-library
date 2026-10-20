import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../utils/format';
import { User, Shield, AlertCircle, Info, Mail, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [role, setRole] = useState('pengguna');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage] = useState(() =>
    location.state?.registered ? 'Pendaftaran berhasil. Silakan masuk dengan akun baru Anda.' : '',
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Email atau kata sandi belum sesuai.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      // Peran ditentukan oleh akun di server; tab hanya memilih tujuan.
      const user = await login(email, password, role === 'admin');
      if (role === 'admin' && user.role !== 'ADMIN') {
        setErrorMessage('Akun ini tidak memiliki akses admin.');
        return;
      }
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      setErrorMessage(apiErrorMessage(error, 'Gagal masuk. Coba lagi beberapa saat.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-end mb-10">
        <span className="text-[11px] tracking-[0.2em] font-bold text-stone-400 uppercase">
          PERPUSTAKAAN DIGITAL KAMPUS
        </span>
      </div>

      <div className="mb-8">
        <span className="text-xs font-bold tracking-[0.15em] text-stone-400 uppercase block mb-3">
          SELAMAT DATANG KEMBALI
        </span>
        <h2 className="text-4xl xl:text-[46px] font-serif text-stone-900 font-normal leading-[1.15]">
          Mulai dari rasa ingin tahu.
        </h2>
        <p className="text-stone-500 text-base mt-3">
          Masuk ke ruang belajar Anda dan lanjutkan penjelajahan.
        </p>
      </div>

      <div className="bg-[#eae4d3] p-1.5 rounded-2xl flex gap-1 mb-8">
        <button
          type="button"
          onClick={() => { setRole('pengguna'); setErrorMessage(''); }}
          className={`flex-1 py-3.5 px-4 text-sm font-semibold rounded-xl flex items-center justify-center gap-2.5 transition cursor-pointer ${
            role === 'pengguna'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <User className="w-4 h-4" /> Pengguna
        </button>
        <button
          type="button"
          onClick={() => { setRole('admin'); setErrorMessage(''); }}
          className={`flex-1 py-3.5 px-4 text-sm font-semibold rounded-xl flex items-center justify-center gap-2.5 transition cursor-pointer ${
            role === 'admin'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Shield className="w-4 h-4" /> Admin
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-sm flex gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-red-500 text-xs mt-0.5">Periksa kembali data Anda dan pastikan peran yang dipilih benar.</p>
          </div>
        </div>
      )}

      {infoMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 text-sm flex gap-3 text-emerald-800">
          <Info className="w-5 h-5 shrink-0 text-emerald-700 mt-0.5" />
          <p className="font-semibold">{infoMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-2xl py-4 px-4 pr-12 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#16382c] transition"
              placeholder="Masukkan email kampus"
              required
            />
            <Mail className="w-5 h-5 text-stone-400 absolute right-4 top-4.5" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Kata sandi</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white border rounded-2xl py-4 px-4 pr-12 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                errorMessage ? 'border-red-400 focus:ring-red-400' : 'border-stone-300 focus:ring-[#16382c]'
              }`}
              placeholder="Masukkan kata sandi"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4.5 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#133227] hover:bg-[#0a2018] text-white py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-wait"
        >
          <ArrowRight className="w-5 h-5" /> {submitting ? 'Memproses...' : `Masuk sebagai ${role}`}
        </button>
      </form>

      <div className="mt-8 text-center space-y-6">
        <p className="text-sm text-stone-500">
          Belum memiliki akun?{' '}
          <Link to="/register" className="font-semibold text-stone-900 hover:underline inline-flex items-center gap-1">
            Daftar sebagai pengguna <ArrowRight className="w-4 h-4 inline" />
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-stone-400 pt-2">
          <Lock className="w-4 h-4" />
          <span>Akses admin hanya untuk pengelola perpustakaan yang terdaftar.</span>
        </div>
      </div>
    </AuthLayout>
  );
}
