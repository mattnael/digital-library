import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import ContentCard from '../components/ContentCard';
import ContentState from '../components/ContentState';
import { contentApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

const TABS = ['Semua konten', 'E-book', 'Research Paper', 'Video YouTube'];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Semua konten');
  const [state, setState] = useState({ loading: true, error: null, items: [] });

  const load = useCallback(() => {
    contentApi
      .list({ limit: 6, type: activeTab === 'Semua konten' ? undefined : activeTab })
      .then((data) => setState({ loading: false, error: null, items: data.data }))
      .catch(() =>
        setState({ loading: false, error: 'Gagal memuat koleksi. Periksa koneksi dan coba lagi.', items: [] }),
      );
  }, [activeTab]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset spinner di handler (bukan di effect) sesuai aturan react-hooks.
  const switchTab = (tab) => {
    setActiveTab(tab);
    setState({ loading: true, error: null, items: [] });
  };

  const retry = () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    load();
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Title dengan nama dinamis */}
        <div>
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Digital Library
          </span>
          <h1 className="text-4xl font-serif text-stone-900 font-normal mt-1">
            Welcome, {user?.fullName || 'User'}.
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
            <button
              onClick={() => navigate('/katalog')}
              className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              Cari konten <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Content Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-stone-100 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
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

        {/* CATALOG GRID */}
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs text-stone-500">
            <span>Koleksi terbaru</span>
            <button onClick={() => navigate('/katalog')} className="cursor-pointer hover:text-stone-800 font-medium">
              Lihat semua di katalog ▾
            </button>
          </div>

          <ContentState
            loading={state.loading}
            error={state.error}
            empty={!state.loading && !state.error && state.items.length === 0}
            emptyHint="Konten akan muncul setelah pengelola menambahkannya."
            onRetry={state.error ? retry : undefined}
          />

          {!state.loading && !state.error && state.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {state.items.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
