import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../utils/format';
import { Eye, EyeOff, Check, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak sama.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage('Centang persetujuan ketentuan penggunaan terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setFieldErrors({});
    try {
      await register(formData.fullName, formData.email, formData.password);
      navigate('/login', { state: { registered: true } });
    } catch (error) {
      const details = error?.response?.data?.details;
      if (Array.isArray(details) && details.length > 0) {
        setFieldErrors(Object.fromEntries(details.map((item) => [item.field, item.message])));
        setErrorMessage('Periksa kembali data yang diisi.');
      } else {
        setErrorMessage(apiErrorMessage(error, 'Pendaftaran gagal. Coba lagi beberapa saat.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isPasswordValid = formData.password.length >= 8 && /\d/.test(formData.password);

  const fieldClass = (field) =>
    `w-full bg-white border rounded-2xl py-4 px-4 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition ${
      fieldErrors[field] ? 'border-red-400 focus:ring-red-400' : 'border-stone-300 focus:ring-[#16382c]'
    }`;

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

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-sm flex gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Nama lengkap *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={fieldClass('fullName')}
            placeholder="Masukkan nama lengkap"
            required
          />
          {fieldErrors.fullName && (
            <p className="text-xs text-red-600 mt-1.5">{fieldErrors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Email kampus *</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={fieldClass('email')}
              placeholder="nama@kampus.ac.id"
              required
            />
            {formData.email.includes('@kampus.ac.id') && (
              <Check className="w-5 h-5 text-emerald-700 absolute right-4 top-4.5" />
            )}
          </div>
          {fieldErrors.email ? (
            <p className="text-xs text-red-600 mt-1.5">{fieldErrors.email}</p>
          ) : (
            <p className="text-xs text-stone-400 mt-1.5">Gunakan alamat email kampus yang aktif.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Kata sandi *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={fieldClass('password')}
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
          {fieldErrors.password && (
            <p className="text-xs text-red-600 mt-1.5">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Konfirmasi kata sandi *</label>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={fieldClass('confirmPassword')}
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
          disabled={submitting}
          className="w-full bg-[#133227] hover:bg-[#0a2018] text-white py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition shadow-sm mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
        >
          <ArrowRight className="w-5 h-5" /> {submitting ? 'Mendaftarkan...' : 'Buat akun pengguna'}
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
