import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { ArrowLeft, Play, ExternalLink, ArrowRight } from 'lucide-react';

export default function VideoPlayerPage() {
  const navigate = useNavigate();

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali jelajahi / Video YouTube / Title
        </button>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Kolom Kiri: Video Player & Meta Deskripsi */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Custom YouTube Screen Frame */}
            <div className="w-full bg-[#112d22] rounded-3xl overflow-hidden border border-stone-800 shadow-lg flex flex-col">
              
              {/* Screen Canvas */}
              <div className="relative aspect-video bg-[#16382c] p-8 xl:p-12 flex items-center justify-between text-white overflow-hidden">
                <div className="space-y-2 max-w-xs z-10">
                  <h2 className="text-3xl xl:text-4xl font-serif font-normal">Title</h2>
                  <p className="text-xs text-stone-300">Episode 00 - Lorem Ipsum</p>
                </div>

                {/* Big Centered Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition">
                    <Play className="w-7 h-7 fill-[#16382c] text-[#16382c] ml-1" />
                  </div>
                </div>

                {/* Illustration Preview Box */}
                <div className="hidden sm:block w-44 h-32 bg-[#d4bc96] rounded-xl p-3 shrink-0 z-10 shadow">
                  <div className="w-full h-10 bg-[#16382c] rounded-md mb-2" />
                  <div className="space-y-1.5">
                    <div className="h-2 bg-[#8c7857] rounded w-full" />
                    <div className="h-2 bg-[#8c7857] rounded w-3/4" />
                    <div className="h-2 bg-[#8c7857] rounded w-1/2" />
                  </div>
                </div>
              </div>

              {/* Player Bottom Control Bar */}
              <div className="bg-[#0c2118] px-6 py-3 flex justify-between items-center text-[11px] text-stone-300 border-t border-stone-800">
                <div className="flex items-center gap-3">
                  <Play className="w-3.5 h-3.5 fill-white text-white cursor-pointer" />
                  <span>Volume</span>
                  <span className="font-mono text-stone-400">00:00 / 18:42</span>
                </div>
                <div className="flex items-center gap-4 text-stone-400">
                  <span>YouTube</span>
                  <span>HD</span>
                  <span>Layar penuh ↗</span>
                </div>
              </div>

            </div>

            {/* Video Meta Info & Description */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                  Video YouTube
                </span>
                <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                  STUDIO BELAJAR
                </p>
                <h1 className="text-3xl font-serif text-stone-900 font-normal mt-1">
                  Video Title
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Studio Belajar · 18:42 menit · Dipublikasikan 8 Agustus 2025
                </p>
              </div>

              <div className="flex gap-2 text-xs">
                <span className="bg-[#e9e4d5] text-stone-800 px-3 py-1 rounded-md text-[11px] font-medium">
                  Mata Kuliah Lorem Ipsum
                </span>
                <span className="bg-[#e9e4d5] text-stone-800 px-3 py-1 rounded-md text-[11px] font-medium">
                  Genre Lorem Ipsum
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed pt-1">
                Description Lorem Ipsum
              </p>

              <button className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm">
                Buka di YouTube <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Kolom Kanan: Perdalam Pemahaman */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-stone-900">Perdalam pemahaman</h3>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  onClick={() => navigate('/buku/1')}
                  className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer space-y-2 group"
                >
                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-block">
                    E-book
                  </span>
                  <h4 className="font-serif font-bold text-stone-900 text-sm">Title</h4>
                  <p className="text-xs text-stone-500">Author</p>
                  <p className="text-[11px] text-stone-400">2000 · 999 halaman · PDF / EPUB</p>

                  <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[#16382c] group-hover:translate-x-1 transition">
                    <span>Lihat detail</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
}