import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function BookDetailPage() {
  const navigate = useNavigate();

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali jelajahi / E-book / Detail konten
        </button>

        {/* Header E-Book Box */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="h-80 bg-[#d4bc96] rounded-2xl p-6 flex flex-col justify-between text-stone-900 shadow-md relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider">E-BOOK</span>
            <div>
              <h2 className="text-3xl font-serif font-bold">Title</h2>
            </div>
            <span className="text-xs text-stone-700">Author</span>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                E-book - PDF / EPUB
              </span>
              <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mt-3">
                KOLEKSI AKADEMIK
              </p>
              <h1 className="text-3xl xl:text-4xl font-serif text-stone-900 font-normal mt-1">
                E-Book Title
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Author · Penerbit · Edisi revisi 2000
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-stone-100 text-xs">
              <div>
                <span className="text-stone-400 uppercase text-[9px] block mb-1">Mata kuliah</span>
                <span className="font-semibold text-stone-800">Lorem Ipsum</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase text-[9px] block mb-1">Genre</span>
                <span className="font-semibold text-stone-800">Lorem Ipsum</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase text-[9px] block mb-1">ISBN</span>
                <span className="font-semibold text-stone-800">123-456-789</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase text-[9px] block mb-1">Bahasa</span>
                <span className="font-semibold text-stone-800">Indonesia</span>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              Lorem ipsum dolor sit amet
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/baca/1')}
                className="bg-[#133227] hover:bg-[#0a2018] text-white px-8 py-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                Buka e-book <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-stone-400">
                248 halaman · 8,4 MB · Akses digital
              </span>
            </div>
          </div>
        </div>

        {/* Info Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-4">
            <h3 className="text-xl font-serif text-stone-900">Tentang buku ini</h3>
            <p className="text-xs text-stone-600">Lorem ipsum dolor sit amet</p>
            
            <div className="pt-4 space-y-2 text-xs font-medium text-stone-700">
              <p>01 Inti buku 1</p>
              <p>02 Inti buku 2</p>
              <p>03 Inti buku 3</p>
            </div>
          </div>

          <div className="bg-[#eef3f0] border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-stone-900 text-base">Siap dibaca di Project Title</h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Pilih format PDF atau EPUB pada pembaca. Gunakan navigasi bab dan halaman untuk membaca sesuai kebutuhan Anda.
              </p>
            </div>
            <p className="text-[10px] text-stone-400 pt-4 border-t border-stone-200/60">
              Ditambahkan 28 September 2024 · Diperbarui 17 Oktober 2026
            </p>
          </div>
        </div>

        {/* Rekomendasi */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif text-stone-900">Lanjutkan penjelajahan Anda</h3>
            <span className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer">
              Lihat semua koleksi →
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                onClick={() => navigate('/buku/1')}
                className="bg-white border border-stone-200/80 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition cursor-pointer"
              >
                <div className="w-16 h-20 bg-[#d4bc96] rounded-lg shrink-0 p-2 flex flex-col justify-between text-[9px]">
                  <span className="font-bold">E-book</span>
                  <span>Title</span>
                </div>
                <div className="text-xs space-y-1">
                  <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[9px] font-semibold">E-book</span>
                  <p className="font-serif font-bold text-stone-900">Title</p>
                  <p className="text-stone-500 text-[11px]">Author</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </UserLayout>
  );
}