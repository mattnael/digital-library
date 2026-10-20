import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, ArrowLeft, Download } from 'lucide-react';
import ContentState from '../components/ContentState';
import { useContent } from '../hooks/useContent';
import { contentApi } from '../api/endpoints';
import { formatFileSize, routeForContent } from '../utils/format';
import { useAuth } from '../context/AuthContext';

export default function ReaderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { loading, error, content, typeMismatch } = useContent(id, 'E-book');
  const [blobUrl, setBlobUrl] = useState(null);
  const [fileError, setFileError] = useState(false);

  // Salah jenis konten? Arahkan ke halaman yang benar.
  useEffect(() => {
    if (typeMismatch && content) {
      navigate(routeForContent(content), { replace: true });
    }
  }, [typeMismatch, content, navigate]);

  // Reset saat konten berganti dilakukan saat render, bukan di effect.
  const [prevContentId, setPrevContentId] = useState(content?.id);
  if (prevContentId !== content?.id) {
    setPrevContentId(content?.id);
    setBlobUrl(null);
    setFileError(false);
  }

  useEffect(() => {
    if (!content?.file || content.file.format !== '.pdf') {
      return;
    }
    let cancelled = false;
    let revoke = null;
    contentApi
      .fileBlobUrl(content.id)
      .then((url) => {
        if (!cancelled) {
          revoke = () => URL.revokeObjectURL(url);
          setBlobUrl(url);
        } else {
          URL.revokeObjectURL(url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFileError(true);
        }
      });
    return () => {
      cancelled = true;
      if (revoke) {
        revoke();
      }
    };
  }, [content]);

  const fileStatus = fileError ? 'error' : blobUrl ? 'ready' : 'loading';

  if (typeMismatch) {
    return null;
  }

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
          <span className="font-semibold text-stone-800">{user?.fullName || 'User'}</span>
          <span className="text-stone-300">|</span>
          <button
            onClick={() => navigate('/login')}
            className="text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
          >
            SignOut ↗
          </button>
        </div>
      </header>

      {/* Reader Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Sidebar Kiri: Info Dokumen */}
        <aside className="w-full lg:w-80 bg-white border-r border-stone-200/80 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <button
              onClick={() => navigate(`/buku/${id}`)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke detail
            </button>

            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                Dokumen
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-400 uppercase text-[9px] block mb-1">Judul</span>
                  <p className="font-serif font-bold text-stone-900 leading-snug">
                    {content?.title || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400 uppercase text-[9px] block mb-1">Penulis</span>
                  <p className="font-medium text-stone-700">{content?.author || '-'}</p>
                </div>
                {content?.file && (
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] block mb-1">Berkas</span>
                    <p className="font-medium text-stone-700">
                      {content.file.format.replace('.', '').toUpperCase()} · {formatFileSize(content.file.size)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {content?.file && (
            <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400 space-y-2">
              <p className="font-semibold text-stone-600">
                Format {content.file.format.replace('.', '').toUpperCase()}
              </p>
              {blobUrl && (
                <a
                  href={blobUrl}
                  download={content.file.name || undefined}
                  className="inline-flex items-center gap-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-4 py-2 rounded-xl text-[11px] font-semibold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh berkas
                </a>
              )}
            </div>
          )}
        </aside>

        {/* Canvas Pembaca */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-10">
          <ContentState loading={loading} error={error} />

          {!loading && !error && content && !content.file && (
            <ContentState
              empty
              emptyHint="Berkas untuk e-book ini belum diunggah oleh pengelola."
            />
          )}

          {!loading && !error && content?.file && (
            content.file.format === '.pdf' ? (
              fileStatus === 'ready' ? (
                <iframe
                  src={blobUrl}
                  title={content.title}
                  className="flex-1 min-h-[70vh] w-full bg-white border border-stone-200/80 rounded-2xl shadow-sm"
                />
              ) : (
                <ContentState
                  loading={fileStatus === 'loading'}
                  error={fileStatus === 'error' ? 'Gagal memuat berkas. Coba lagi beberapa saat.' : null}
                />
              )
            ) : (
              <ContentState
                empty
                emptyHint="Pembaca EPUB di browser belum tersedia. Silakan unduh berkas untuk dibaca di aplikasi EPUB."
              />
            )
          )}
        </div>

      </div>

    </div>
  );
}
