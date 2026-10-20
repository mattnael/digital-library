import { AlertCircle } from 'lucide-react';

// State loading/error/kosong untuk halaman berbasis data (wajib ada tiganya
// agar UI tidak pernah diam tanpa penjelasan).
export default function ContentState({ loading, error, empty, emptyHint, onRetry }) {
  if (loading) {
    return (
      <div className="bg-white border border-stone-200/80 rounded-2xl p-12 shadow-sm text-center space-y-2">
        <div className="w-8 h-8 mx-auto border-[3px] border-stone-200 border-t-[#133227] rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-10 shadow-sm text-center space-y-3">
        <AlertCircle className="w-8 h-8 mx-auto text-red-400" />
        <p className="text-sm font-semibold text-stone-800">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            Coba lagi
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="bg-white border border-stone-200/80 rounded-2xl p-12 shadow-sm text-center">
        <p className="text-sm font-semibold text-stone-800">Belum ada konten.</p>
        {emptyHint && <p className="text-xs text-stone-500 mt-1">{emptyHint}</p>}
      </div>
    );
  }

  return null;
}
