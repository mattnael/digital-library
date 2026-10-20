import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { ArrowRight, Play, FileText, BookOpen } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Semua konten');

  const [userName] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) return parsed.name;
        if (parsed.email) {
          const nameFromEmail = parsed.email.split('@')[0];
          return nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        }
      } catch {
        return 'User';
      }
    }
    return 'User';
  });

  // Dummy Collection Data
  const allItems = [
    {
      id: 1,
      type: 'E-book',
      title: 'Dasar-Dasar Desain Interaksi',
      author: 'Dewi Anggraini',
      category: 'Interaksi Manusia & Komputer · Desain',
      meta: '2026 · 248 halaman · PDF / EPUB',
      route: '/buku/1',
      bgCard: 'bg-[#d4bc96]',
      badgeColor: 'bg-white/90 text-[#133227]'
    },
    {
      id: 2,
      type: 'Research Paper',
      title: 'Literasi Visual dalam Pembelajaran Digital',
      author: 'Ratna Wulandari, Andi Santoso',
      category: 'Teknologi Pendidikan · Penelitian',
      meta: '2025 · 12 halaman · PDF',
      route: '/paper/2',
      bgCard: 'bg-[#e5ecef]',
      badgeColor: 'bg-[#133227] text-white'
    },
    {
      id: 3,
      type: 'Video YouTube',
      title: 'Memahami Prinsip Desain Antarmuka',
      author: 'Studio Belajar',
      category: 'Interaksi Manusia & Komputer · UI/UX',
      meta: '2025 · 18:42 menit · YouTube',
      route: '/video/3',
      bgCard: 'bg-[#133227]',
      badgeColor: 'bg-emerald-400 text-stone-900',
      isVideo: true
    },
    {
      id: 4,
      type: 'E-book',
      title: 'Pengantar Sains Data dan Analisis',
      author: 'Arief Wicaksono',
      category: 'Sains Data · Teknologi',
      meta: '2026 · 310 halaman · PDF / EPUB',
      route: '/buku/1',
      bgCard: 'bg-[#b2cadb]',
      badgeColor: 'bg-white/90 text-[#133227]'
    },
    {
      id: 5,
      type: 'Research Paper',
      title: 'Evaluasi Usability pada Platform Pembelajaran Digital',
      author: 'Siti Rahmawati, Budi Santoso',
      category: 'Interaksi Manusia & Komputer · SUS Method',
      meta: '2025 · 14 halaman · PDF',
      route: '/paper/2',
      bgCard: 'bg-[#e5ecef]',
      badgeColor: 'bg-[#133227] text-white'
    },
    {
      id: 6,
      type: 'Video YouTube',
      title: 'Eksplorasi Tipografi dan Hierarki Visual',
      author: 'Kelas Terbuka',
      category: 'Desain Grafis · Tutorial',
      meta: '2026 · 24:18 menit · YouTube',
      route: '/video/3',
      bgCard: 'bg-[#1c3829]',
      badgeColor: 'bg-emerald-400 text-stone-900',
      isVideo: true
    }
  ];

  // Filter Tab
  const filteredItems = allItems.filter(item => {
    if (activeTab === 'Semua konten') return true;
    if (activeTab === 'E-book') return item.type === 'E-book';
    if (activeTab === 'Research Paper') return item.type === 'Research Paper';
    if (activeTab === 'Video YouTube') return item.type === 'Video YouTube';
    return true;
  });

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Title dengan nama dinamis */}
        <div>
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Digital Library
          </span>
          <h1 className="text-4xl font-serif text-stone-900 font-normal mt-1">
            Welcome, {userName}.
          </h1>
        </div>

        {/* Search Bar Section */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-4">
          <span className="text-xs font-bold text-stone-700 block">Cari di seluruh koleksi</span>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari judul, penulis, atau kata kunci..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>
            <button className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer">
              Cari konten <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Content Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-stone-100 overflow-x-auto">
            {['Semua konten', 'E-book', 'Research Paper', 'Video YouTube'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#133227] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Filter Sidebar & Catalog Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* FILTER SIDEBAR */}
          <div className="w-full lg:w-72 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-6 shrink-0">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
              Filter koleksi
            </span>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-2">Mata kuliah</label>
                <input
                  type="text"
                  placeholder="Semua mata kuliah"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-600 focus:outline-none"
                  readOnly
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-2">Genre</label>
                <input
                  type="text"
                  placeholder="Semua genre"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-600 focus:outline-none"
                  readOnly
                />
              </div>

              <button className="w-full bg-[#133227] hover:bg-[#0a2018] text-white py-3 rounded-xl font-semibold transition cursor-pointer">
                Terapkan filter
              </button>

              <div className="text-center pt-2">
                <button className="text-stone-500 hover:text-stone-800 text-xs font-medium">
                  Reset semua filter
                </button>
              </div>
            </div>
          </div>

          {/* CATALOG GRID */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>Menampilkan {filteredItems.length} dari 1.284 hasil</span>
              <span className="cursor-pointer hover:text-stone-800 font-medium">Urutkan: Terbaru ▾</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:shadow-md transition flex flex-col justify-between p-4 cursor-pointer group"
                >
                  {/* Thumbnail Banner Berdasarkan Jenis */}
                  <div className={`h-44 ${item.bgCard} rounded-xl mb-4 p-4 flex flex-col justify-between relative text-stone-900 overflow-hidden shadow-inner`}>
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${item.badgeColor}`}>
                        {item.type}
                      </span>
                      {item.isVideo && (
                        <div className="w-8 h-8 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      )}
                      {item.type === 'Research Paper' && (
                        <FileText className="w-5 h-5 text-stone-600" />
                      )}
                      {item.type === 'E-book' && (
                        <BookOpen className="w-5 h-5 text-stone-700" />
                      )}
                    </div>
                    <h4 className="font-serif text-base font-bold line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                  </div>

                  {/* Detail Konten */}
                  <div className="space-y-1.5 text-xs">
                    <p className="font-semibold text-stone-900 line-clamp-1">{item.title}</p>
                    <p className="text-stone-500">{item.author}</p>
                    <p className="text-stone-400 truncate">{item.category}</p>
                    <p className="text-[11px] text-stone-400 pt-1">{item.meta}</p>
                  </div>

                  {/* Footer Card */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs font-semibold text-[#133227]">
                    <span>Lihat detail</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-stone-200/80 text-xs text-stone-500 gap-4">
              <span>Menampilkan hasil penyaringan</span>
              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50" disabled>
                  ← Sebelumnya
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#133227] text-white font-semibold flex items-center justify-center">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center">
                  3
                </button>
                <span className="px-1 text-stone-400">...</span>
                <button className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50">
                  Berikutnya →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
}