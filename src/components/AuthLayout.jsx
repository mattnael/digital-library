import { BookOpen, ArrowUpRight } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-[#f8f6f0] text-stone-800 font-sans">
      {/* SISI KIRI - Hero Banner */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 xl:p-16 overflow-hidden bg-stone-900 text-white">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-overlay"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a20]/95 via-transparent to-black/30" />

        {/* Branding Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white text-stone-900 rounded-lg">
            <BookOpen className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-3xl font-serif font-bold tracking-tight">laras.</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-xl mb-4">
          <span className="text-xs uppercase tracking-[0.2em] text-stone-300 font-semibold mb-3 block">
            Pengetahuan, Tanpa Batas.
          </span>
          <h1 className="text-5xl xl:text-6xl font-serif font-normal leading-[1.15] mb-6">
            Setiap halaman,<br />sebuah kemungkinan.
          </h1>
          <p className="text-stone-300 text-base leading-relaxed mb-12 max-w-md">
            Temukan e-book, riset, dan video pembelajaran untuk menemani perjalanan akademik Anda.
          </p>

          <hr className="border-stone-700/80 mb-8" />

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-serif font-normal">1.248</div>
              <div className="text-xs text-stone-400 mt-1">koleksi digital</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-normal">32</div>
              <div className="text-xs text-stone-400 mt-1">mata kuliah</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-normal">3</div>
              <div className="text-xs text-stone-400 mt-1">format belajar</div>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN - Form Content */}
      <div className="flex-1 flex flex-col justify-between p-8 md:p-12 xl:p-16 overflow-y-auto">
        <div className="w-full max-w-[620px] mx-auto my-auto py-6">
          {children}
        </div>

        {/* Footer */}
        <div className="w-full max-w-[620px] mx-auto pt-8 mt-auto flex justify-between items-center text-xs text-stone-400">
          <span>© 2026 Laras. Ruang ilmu bersama.</span>
          <a href="#bantuan" className="flex items-center gap-1 hover:text-stone-600 transition">
            Pusat bantuan <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}