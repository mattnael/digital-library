import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function ReaderPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(12);
  const totalPages = 249;
  const [format, setFormat] = useState('EPUB');

  const toc = [
    { title: 'Kata pengantar' },
    { title: 'Dasar komunikasi visual', active: true },
    { title: 'Unsur dan prinsip desain' },
    { title: 'Tipografi sebagai bahasa visual' },
    { title: 'Warna dan persepsi' },
    { title: 'Aplikasi media visual' },
    { title: 'Daftar Project Title' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-stone-800 font-sans flex flex-col">
      
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="p-1.5 bg-[#133227] text-white rounded-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-serif font-bold text-stone-900 tracking-tight">Project Title</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="font-semibold text-stone-800">User</span>
          <span className="text-stone-300">|</span>
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
          >
            SignOut ↗
          </button>
        </div>
      </header>

      {/* Reader Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Sidebar Kiri: Daftar Isi */}
        <aside className="w-full lg:w-80 bg-white border-r border-stone-200/80 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <button
              onClick={() => navigate('/buku/1')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke perProject Titlean
            </button>

            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                Daftar isi
              </h3>
              <div className="space-y-1 text-xs font-medium">
                {toc.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl transition cursor-pointer ${
                      item.active
                        ? 'bg-[#e5ede9] text-[#133227] font-bold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {String(idx).padStart(2, '0')} {item.title}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400 space-y-1">
            <p className="font-semibold text-stone-600">Format {format}</p>
            <p>Halaman {currentPage} dari {totalPages} · Bab 1</p>
          </div>
        </aside>

        {/* Canvas Pembaca */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 lg:p-12">
          
          {/* Top Controls */}
          <div className="max-w-4xl mx-auto w-full flex justify-between items-center pb-6 border-b border-stone-200/60 text-xs">
            <div>
              <p className="font-serif font-bold text-stone-900">Title</p>
              <p className="text-[10px] text-stone-400">Author - Edisi revisi 2000</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex bg-stone-200/80 p-1 rounded-xl">
                <button
                  onClick={() => setFormat('EPUB')}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${format === 'EPUB' ? 'bg-[#133227] text-white shadow-sm' : 'text-stone-600'}`}
                >
                  EPUB
                </button>
                <button
                  onClick={() => setFormat('PDF')}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${format === 'PDF' ? 'bg-[#133227] text-white shadow-sm' : 'text-stone-600'}`}
                >
                  PDF
                </button>
              </div>

              <div className="flex items-center gap-2 text-stone-600">
                <span>Ukuran teks</span>
                <button className="px-2 py-1 bg-white border border-stone-200 rounded font-bold">A-</button>
                <span className="font-semibold text-stone-800">100%</span>
                <button className="px-2 py-1 bg-white border border-stone-200 rounded font-bold">A+</button>
              </div>
            </div>
          </div>

          {/* Halaman Lembaran */}
          <div className="max-w-3xl mx-auto w-full bg-white border border-stone-200/80 rounded-2xl p-10 lg:p-16 my-8 shadow-sm space-y-6 font-serif">
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
              BAB 1 / DASAR KOMUNIKASI VISUAL
            </span>

            <div className="space-y-2">
              <span className="text-xs text-stone-400 uppercase tracking-widest block">Bab 1</span>
              <h1 className="text-3xl xl:text-4xl font-serif font-normal text-stone-900 leading-tight">
                Melihat, memahami, dan menyampaikan.
              </h1>
            </div>

            <div className="text-sm font-sans text-stone-700 leading-relaxed space-y-4 font-normal pt-2">
              <p>
                Setiap hari kita membaca dunia melalui gambar. Sebuah tanda di jalan, susunan huruf pada halaman, atau warna pada kemasan menyampaikan pesan sebelum kita sempat menyadarinya.
              </p>
              <p>
                Komunikasi visual adalah proses menyampaikan gagasan melalui unsur yang dapat dilihat. Di dalamnya, bentuk, warna, tipografi, dan ruang bekerja bersama untuk membangun makna. Desain bukan sekadar membuat sesuatu terlihat menarik, melainkan membantu orang memahami informasi dengan lebih baik.
              </p>
              
              <h3 className="text-lg font-serif font-bold text-stone-900 pt-4">1.1 Pesan dan konteks</h3>
              <p>
                Sebuah pesan selalu hadir dalam konteks. Siapa yang melihatnya? Di mana pesan itu ditemukan? Apa yang perlu dipahami pembaca? Pertanyaan-pertanyaan tersebut menjadi titik awal dalam merancang komunikasi yang tepat. Dengan memahami konteks, desainer dapat memilih bahasa visual yang relevan bagi pembacanya.
              </p>
            </div>

            <div className="pt-8 flex justify-between text-[10px] text-stone-400 border-t border-stone-100 font-sans">
              <span>Dasar komunikasi visual</span>
              <span>12</span>
            </div>
          </div>

          {/* Bottom Pagination */}
          <div className="max-w-4xl mx-auto w-full pt-6 border-t border-stone-200/60 flex justify-between items-center text-xs font-semibold">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="bg-white border border-stone-200 hover:bg-stone-50 px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
            >
              ← Halaman sebelumnya
            </button>
            <span className="text-stone-500 font-medium">Halaman {currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="bg-white border border-stone-200 hover:bg-stone-50 px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
            >
              Halaman berikutnya →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}