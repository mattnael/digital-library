import { useEffect, useState } from 'react';
import { contentApi } from '../api/endpoints';

// Mengambil satu konten untuk halaman detail/reader/video. Reset saat id
// berubah dilakukan saat render (pola React "adjusting state on prop change")
// agar tidak ada setState sinkron di dalam effect.
export function useContent(id, expectedType) {
  const [state, setState] = useState({ loading: true, error: null, content: null });
  const [prevId, setPrevId] = useState(id);

  if (prevId !== id) {
    setPrevId(id);
    setState({ loading: true, error: null, content: null });
  }

  useEffect(() => {
    let cancelled = false;
    contentApi
      .detail(id)
      .then((data) => {
        if (!cancelled) {
          setState({ loading: false, error: null, content: data.content });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            loading: false,
            error:
              error?.response?.status === 404
                ? 'Konten tidak ditemukan atau sudah dinonaktifkan.'
                : 'Gagal memuat konten. Coba lagi beberapa saat.',
            content: null,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const typeMismatch = state.content && expectedType && state.content.contentType !== expectedType;

  return { ...state, typeMismatch };
}
