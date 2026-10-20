import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import ContentState from '../components/ContentState';
import { useContent } from '../hooks/useContent';
import { contentApi } from '../api/endpoints';
import { formatFileSize, routeForContent } from '../utils/format';
import { ArrowLeft, Download } from 'lucide-react';

export default function PaperPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, content, typeMismatch } = useContent(id, 'Research Paper');
  const fileAvailable = Boolean(content?.file);
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
    <UserLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center text-xs">
          <button
            onClick={() => navigate('/katalog')}
            className="inline-flex items-center gap-2 font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali jelajahi
          </button>

          <span className="font-serif font-bold text-stone-800 text-sm line-clamp-1 max-w-xs sm:max-w-md">
            {content?.title || '...'}
          </span>

          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0">
            RESEARCH PAPER · {content?.file ? content.file.format.replace('.', '') : 'PDF'}
          </span>
        </div>

        <ContentState loading={loading} error={error} />

        {!loading && !error && content && (
          <>
            {/* PDF Viewer Bar */}
            <div className="bg-[#16382c] text-white rounded-xl px-6 py-3 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center text-xs shadow-sm">
              <span className="font-mono text-[11px] text-emerald-200 truncate max-w-full">
                {content.file?.name || 'Berkas belum tersedia'}
              </span>

              <div className="flex items-center gap-4 text-stone-300">
                <span className="font-mono text-[11px]">
                  {content.file ? formatFileSize(content.file.size) : '-'}
                </span>
                {fileAvailable && blobUrl && (
                  <a
                    href={blobUrl}
                    download={content.file?.name || undefined}
                    className="inline-flex items-center gap-1.5 hover:text-white text-[11px] font-medium cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </a>
                )}
              </div>
            </div>

            {/* Content Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* Sidebar Kiri: Metadata */}
              <div className="w-full lg:w-72 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-6 shrink-0">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Metadata
                </span>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] block mb-1">Penulis</span>
                    <p className="font-medium text-stone-700 leading-snug">{content.author}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] block mb-1">Mata kuliah</span>
                    <p className="font-medium text-stone-700">{content.course?.nama || '-'}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase text-[9px] block mb-1">Genre</span>
                    <p className="font-medium text-stone-700">{content.genre?.nama || '-'}</p>
                  </div>
                </div>

                <hr className="border-stone-100" />

                <div className="space-y-2 text-[11px] text-stone-500">
                  <p>{content.publisher || '-'} · {content.publishYear || '-'}</p>
                  {content.file && (
                    <p>{formatFileSize(content.file.size)} · {content.file.format.replace('.', '').toUpperCase()}</p>
                  )}
                </div>
              </div>

              {/* Canvas Lembaran Research Paper */}
              <div className="flex-1 w-full">
                {content.file && content.file.format === '.pdf' ? (
                  fileStatus === 'ready' ? (
                    <iframe
                      src={blobUrl}
                      title={content.title}
                      className="w-full min-h-[75vh] h-[80vh] bg-white border border-stone-200/80 rounded-2xl shadow-sm"
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
                    emptyHint="Berkas PDF untuk paper ini belum diunggah oleh pengelola."
                  />
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </UserLayout>
  );
}
