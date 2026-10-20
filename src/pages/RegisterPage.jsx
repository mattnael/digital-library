import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Eye, EyeOff, Check, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', formData);
  };

  const isPasswordValid = formData.password.length >= 8 && /\d/.test(formData.password);

  return (
    <AuthLayout>
      <div className="flex justify-end mb-10">
        <span className="text-[11px] tracking-[0.2em] font-bold text-stone-400 uppercase">
          PERPUSTAKAAN DIGITAL KAMPUS
        </span>
      </div>

      <div className="mb-8">
        <span className="text-xs font-bold tracking-[0.15em] text-stone-400 uppercase block mb-3">
          AKUN PENGGUNA BARU
        </span>
        <h2 className="text-4xl xl:text-[46px] font-serif text-stone-900 font-normal leading-[1.15]">
          Buka ruang pengetahuan.
        </h2>
        <p className="text-stone-500 text-base mt-3">
          Buat akun untuk mengakses seluruh koleksi digital kampus.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Nama lengkap *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-white border border-stone-300 rounded-2xl py-4 px-4 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#16382c]"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Email kampus *</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white border border-stone-300 rounded-2xl py-4 px-4 pr-12 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#16382c]"
              placeholder="nama@kampus.ac.id"
              required
            />
            {formData.email.includes('@kampus.ac.id') && (
              <Check className="w-5 h-5 text-emerald-700 absolute right-4 top-4.5" />
            )}
          </div>
          <p className="text-xs text-stone-400 mt-1.5">Gunakan alamat email kampus yang aktif.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Kata sandi *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white border border-stone-300 rounded-2xl py-4 px-4 pr-12 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#16382c]"
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
          <div className="flex gap-6 mt-2.5 text-xs text-stone-500">
            <span className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-emerald-700 font-medium' : ''}`}>
              <Check className="w-4 h-4" /> Minimal 8 karakter
            </span>
            <span className={`flex items-center gap-1 ${isPasswordValid ? 'text-emerald-700 font-medium' : ''}`}>
              <Check className="w-4 h-4" /> Huruf & angka
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Konfirmasi kata sandi *</label>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white border border-stone-300 rounded-2xl py-4 px-4 pr-12 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#16382c]"
              placeholder="Ulangi kata sandi"
              required
            />
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <Check className="w-5 h-5 text-emerald-700 absolute right-4 top-4.5" />
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded border-stone-300 text-[#16382c] focus:ring-[#16382c] cursor-pointer"
            required
          />
          <label htmlFor="agreeTerms" className="text-sm text-stone-600 leading-normal cursor-pointer">
            Saya menyetujui Ketentuan Penggunaan dan Kebijakan Privasi Laras.
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-[#133227] hover:bg-[#0a2018] text-white py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition shadow-sm mt-4 cursor-pointer"
        >
          <ArrowRight className="w-5 h-5" /> Buat akun pengguna
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-stone-500">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="font-semibold text-stone-900 hover:underline inline-flex items-center gap-1">
            Masuk di sini <ArrowRight className="w-4 h-4 inline" />
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}