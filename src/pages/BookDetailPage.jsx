import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import ContentState from '../components/ContentState';
import { useContent } from '../hooks/useContent';
import { contentApi } from '../api/endpoints';
import { formatDate, formatFileSize, routeForContent } from '../utils/format';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function BookDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, content, typeMismatch } = useContent(id, 'E-book');
  const [related, setRelated] = useState([]);

  // Salah jenis konten? Arahkan ke halaman yang benar.
  useEffect(() => {
    if (typeMismatch && content) {
      navigate(routeForContent(content), { replace: true });
    }
  }, [typeMismatch, content, navigate]);

  const loadRelated = useCallback(() => {
    if (!content) return;
    contentApi
      .list({ type: 'E-book', limit: 3 })
      .then((data) => setRelated(data.data.filter((item) => item.id !== content.id).slice(0, 3)))
      .catch(() => setRelated([]));
  }, [content]);

  useEffect(() => {
    loadRelated();
  }, [loadRelated]);

  if (typeMismatch) {
    return null;
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate('/katalog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali jelajahi / E-book / Detail konten
        </button>

        <ContentState loading={loading} error={error} />

        {!loading && !error && content && (
          <>
            {/* Header E-Book Box */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="h-80 bg-[#d4bc96] rounded-2xl p-6 flex flex-col justify-between text-stone-900 shadow-md relative overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider">E-BOOK</span>
                <div>
                  <h2 className="text-2xl xl:text-3xl font-serif font-bold line-clamp-4">{content.title}</h2>
                </div>
                <span className="text-xs text-stone-700 line-clamp-2">{content.author}</span>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    E-book - {content.file ? content.file.format.replace('.', '').toUpperCase() : 'PDF'} / EPUB
                  </span>
                  <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mt-3">
                    KOLEKSI AKADEMIK
                  </p>
                  <h1 className="text-3xl xl:text-4xl font-serif text-stone-900 font-normal mt-1">
                    {content.title}
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    {[content.author, content.publisher, content.publishYear].filter(Boolean).join(' · ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] block mb-1">Mata kuliah</span>
                    <span className="font-semibold text-stone-800">{content.course?.nama || '-'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] block mb-1">Genre</span>
                    <span className="font-semibold text-stone-800">{content.genre?.nama || '-'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] block mb-1">ISBN</span>
                    <span className="font-semibold text-stone-800">{content.isbn || '-'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] block mb-1">Bahasa</span>
                    <span className="font-semibold text-stone-800">{content.language || '-'}</span>
                  </div>
                  {content.edition && (
                    <div>
                      <span className="text-stone-400 uppercase text-[9px] block mb-1">Edisi</span>
                      <span className="font-semibold text-stone-800">{content.edition}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {content.description || 'Belum ada deskripsi untuk konten ini.'}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <button
                    onClick={() => navigate(`/baca/${content.id}`)}
                    disabled={!content.file}
                    className="bg-[#133227] hover:bg-[#0a2018] text-white px-8 py-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buka e-book <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-stone-400">
                    {content.file
                      ? `${content.file.format.replace('.', '').toUpperCase()} · ${formatFileSize(content.file.size)} · Akses digital`
                      : 'Berkas belum tersedia'}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-4">
                <h3 className="text-xl font-serif text-stone-900">Tentang buku ini</h3>
                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                  {content.description || 'Belum ada deskripsi untuk konten ini.'}
                </p>
              </div>

              <div className="bg-[#eef3f0] border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">Siap dibaca di Project Title</h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Pilih format PDF atau EPUB pada pembaca. Gunakan navigasi bab dan halaman untuk membaca sesuai kebutuhan Anda.
                  </p>
                </div>
                <p className="text-[10px] text-stone-400 pt-4 border-t border-stone-200/60">
                  Ditambahkan {formatDate(content.createdAt)} · Diperbarui {formatDate(content.updatedAt)}
                </p>
              </div>
            </div>

            {/* Rekomendasi */}
            {related.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-serif text-stone-900">Lanjutkan penjelajahan Anda</h3>
                  <button
                    onClick={() => navigate('/katalog')}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Lihat semua koleksi →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(routeForContent(item))}
                      className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer space-y-1.5 group"
                    >
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-block">
                        {item.contentType}
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-stone-500 line-clamp-1">{item.author}</p>
                      <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[#16382c] group-hover:translate-x-1 transition">
                        <span>Lihat detail</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </UserLayout>
  );
}
