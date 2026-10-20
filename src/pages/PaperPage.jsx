import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { ArrowLeft, Minus, Plus } from 'lucide-react';

export default function PaperPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;

  const sections = [
    { title: 'Abstrak', page: '1', active: true },
    { title: 'Pendahuluan', page: '2' },
    { title: 'Metode penelitian', page: '4' },
    { title: 'Hasil & pembahasan', page: '6' },
    { title: 'Kesimpulan', page: '10' },
    { title: 'Referensi', page: '11' },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center text-xs">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali jelajahi
          </button>
          
          <span className="font-serif font-bold text-stone-800 text-sm">
            Literasi Visual dalam Pembelajaran Digital
          </span>

          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md uppercase tracking-wider">
            RESEARCH PAPER · PDF
          </span>
        </div>

        {/* PDF Viewer Bar */}
        <div className="bg-[#16382c] text-white rounded-xl px-6 py-3 flex justify-between items-center text-xs shadow-sm">
          <span className="font-mono text-[11px] text-emerald-200">literasi-visual-2025.pdf</span>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="hover:text-emerald-300 font-bold px-1"
            >
              ←
            </button>
            <span className="font-medium">Halaman {currentPage} / {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="hover:text-emerald-300 font-bold px-1"
            >
              →
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-3 text-stone-300">
            <button className="hover:text-white p-0.5"><Minus className="w-3.5 h-3.5" /></button>
            <span className="font-mono text-[11px]">100%</span>
            <button className="hover:text-white p-0.5"><Plus className="w-3.5 h-3.5" /></button>
            <span className="text-stone-500">|</span>
            <button className="hover:text-white text-[11px] font-medium">Sesuaikan lebar</button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Kiri: Isi Dokumen */}
          <div className="w-full lg:w-72 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-6 shrink-0">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
              Isi dokumen
            </span>

            <div className="space-y-1 text-xs">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl transition cursor-pointer flex justify-between items-center ${
                    sec.active
                      ? 'bg-[#e5ede9] text-[#16382c] font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{sec.title}</span>
                  <span className="text-[10px] text-stone-400 font-mono">· {sec.page}</span>
                </div>
              ))}
            </div>

            <hr className="border-stone-100" />

            {/* Paper Metadata */}
            <div className="space-y-2 text-[11px] text-stone-500">
              <p><strong className="text-stone-700">Metodologi Penelitian</strong></p>
              <p>Genre: Pendidikan</p>
              <p>2025 · 12 halaman · 1,8 MB</p>
              <div className="pt-2 text-[10px] font-mono text-stone-400 break-all">
                DOI: 10.21831/jtp.v12i2.2025.041
              </div>
            </div>
          </div>

          {/* Canvas Lembaran Research Paper */}
          <div className="flex-1 w-full bg-white border border-stone-200/80 rounded-2xl p-10 lg:p-14 shadow-sm space-y-8 font-serif">
            
            {/* Header Jurnal */}
            <div className="flex justify-between items-center text-[10px] text-stone-400 uppercase tracking-wider border-b border-stone-100 pb-3 font-sans">
              <span className="font-bold text-stone-600">JURNAL TEKNOLOGI PENDIDIKAN</span>
              <span>Vol. 12, No. 2 - 2025 · hlm. 41-53</span>
            </div>

            {/* Judul Paper & Penulis */}
            <div className="space-y-3 font-sans">
              <h1 className="text-2xl xl:text-3xl font-serif text-stone-900 font-normal leading-snug">
                Literasi Visual dalam Pembelajaran Digital: Pendekatan Berbasis Komunikasi Visual
              </h1>
              <p className="text-xs text-stone-700 font-medium">
                Ratna Wulandari<sup>1</sup>, Andi Santoso<sup>2</sup>
              </p>
              <p className="text-[11px] text-stone-400">
                <sup>1,2</sup> Program Studi Teknologi Pendidikan, Universitas Nusantara
              </p>
              <p className="text-[10px] font-mono text-stone-400 pt-1">
                DOI: 10.21831/jtp.v12i2.2025.041 · Diterima 14 Maret 2025
              </p>
            </div>

            {/* Box Abstrak */}
            <div className="bg-[#f8f6f0] border border-stone-200/60 rounded-2xl p-6 space-y-2 font-sans">
              <span className="text-xs font-bold text-stone-900 block">Abstrak</span>
              <p className="text-xs text-stone-600 leading-relaxed">
                Penelitian ini mengkaji peran literasi visual dalam mendukung pemahaman mahasiswa pada lingkungan pembelajaran digital. Pendekatan kualitatif digunakan melalui observasi media pembelajaran dan wawancara terhadap 24 mahasiswa. Hasil penelitian menunjukkan bahwa hierarki visual, konsistensi tipografi, dan pemilihan gambar yang relevan membantu pembaca menghubungkan informasi secara lebih bermakna. Temuan ini merekomendasikan integrasi prinsip komunikasi visual dalam pengembangan materi ajar digital.
              </p>
              <p className="text-[11px] text-stone-400 pt-1">
                <strong className="text-stone-600">Kata kunci:</strong> literasi visual, pembelajaran digital, komunikasi visual
              </p>
            </div>

            {/* Isi Kolom Paper Ganda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans text-stone-700 leading-relaxed pt-2">
              <div className="space-y-3">
                <h3 className="font-bold text-stone-900 text-sm">1. Pendahuluan</h3>
                <p>
                  Perkembangan teknologi mengubah cara mahasiswa mengakses dan memahami pengetahuan. Media digital tidak hanya memuat teks, tetapi juga gambar, diagram, dan video yang membutuhkan kemampuan interpretasi visual. Literasi visual menjadi bagian penting dari proses belajar yang mandiri dan kritis.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-stone-900 text-sm">Konteks penelitian</h3>
                <p>
                  Dalam konteks pendidikan tinggi, penyajian informasi yang terstruktur dapat mengurangi beban kognitif. Penelitian ini berfokus pada pengalaman mahasiswa ketika membaca materi digital dan mengidentifikasi unsur visual yang mendukung pemahaman konsep (Wulandari & Santoso, 2025).
                </p>
              </div>
            </div>

            {/* Footer Lembaran Paper */}
            <div className="pt-8 flex justify-between text-[10px] text-stone-400 border-t border-stone-100 font-sans">
              <span>Wulandari & Santoso / Jurnal Teknologi Pendidikan</span>
              <span>41</span>
            </div>

          </div>

        </div>
      </div>
    </UserLayout>
  );
}