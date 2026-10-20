import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import ContentState from '../components/ContentState';
import { useContent } from '../hooks/useContent';
import { routeForContent } from '../utils/format';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

export default function VideoPlayerPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, content, typeMismatch } = useContent(id, 'Video YouTube');

  // Salah jenis konten? Arahkan ke halaman yang benar.
  useEffect(() => {
    if (typeMismatch && content) {
      navigate(routeForContent(content), { replace: true });
    }
  }, [typeMismatch, content, navigate]);

  if (typeMismatch) {
    return null;
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/katalog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali jelajahi / Video YouTube / {content?.title || '...'}
        </button>

        <ContentState loading={loading} error={error} />

        {!loading && !error && content && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Kolom Kiri: Video Player & Meta Deskripsi */}
            <div className="lg:col-span-2 space-y-6">

              {/* Player YouTube */}
              {content.youtubeId ? (
                <div className="w-full rounded-3xl overflow-hidden border border-stone-800 shadow-lg">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${content.youtubeId}`}
                    title={content.title}
                    className="w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <ContentState empty emptyHint="Tautan video YouTube belum diatur untuk konten ini." />
              )}

              {/* Video Meta Info & Description */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                    Video YouTube
                  </span>
                  <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                    {content.author}
                  </p>
                  <h1 className="text-3xl font-serif text-stone-900 font-normal mt-1">
                    {content.title}
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    {content.durationMinutes ? `${content.durationMinutes} menit · ` : ''}
                    {content.course?.nama ? `${content.course.nama} · ` : ''}
                    {content.genre?.nama || ''}
                  </p>
                </div>

                <div className="flex gap-2 text-xs flex-wrap">
                  {content.course && (
                    <span className="bg-[#e9e4d5] text-stone-800 px-3 py-1 rounded-md text-[11px] font-medium">
                      {content.course.nama}
                    </span>
                  )}
                  {content.genre && (
                    <span className="bg-[#e9e4d5] text-stone-800 px-3 py-1 rounded-md text-[11px] font-medium">
                      {content.genre.nama}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed pt-1 whitespace-pre-line">
                  {content.description || 'Belum ada deskripsi untuk video ini.'}
                </p>

                {content.youtubeUrl && (
                  <a
                    href={content.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 px-5 py-2.5 rounded-xl text-xs font-semibold items-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    Buka di YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>

            {/* Kolom Kanan: Info Konteks */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-stone-900">Tentang video ini</h3>
              <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-2 text-xs text-stone-600 leading-relaxed">
                <p>{content.description || 'Belum ada deskripsi.'}</p>
              </div>
              <button
                onClick={() => navigate('/katalog')}
                className="w-full bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center text-xs font-semibold text-[#133227] group"
              >
                <span>Jelajahi koleksi lain</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </button>
            </div>

          </div>
        )}
      </div>
    </UserLayout>
  );
}
