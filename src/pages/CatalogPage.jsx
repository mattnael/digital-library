import { useCallback, useEffect, useState } from 'react';
import UserLayout from '../components/UserLayout';
import ContentCard from '../components/ContentCard';
import ContentState from '../components/ContentState';
import { contentApi, categoryApi } from '../api/endpoints';
import { ArrowRight, ChevronDown } from 'lucide-react';

const TABS = ['Semua konten', 'E-book', 'Research Paper', 'Video YouTube'];

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Semua konten');
  const [courseId, setCourseId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ courseId: '', genreId: '' });
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState({ courses: [], genres: [] });

  const [state, setState] = useState({ loading: true, error: null, items: [], pagination: null });

  useEffect(() => {
    categoryApi
      .list()
      .then(setCategories)
      .catch(() => {
        // Filter kategori tetap kosong; daftar utama tetap bisa dicari.
      });
  }, []);

  const load = useCallback(() => {
    contentApi
      .list({
        search: appliedSearch || undefined,
        type: activeTab === 'Semua konten' ? undefined : activeTab,
        courseId: appliedFilters.courseId || undefined,
        genreId: appliedFilters.genreId || undefined,
        page,
        limit: 9,
      })
      .then((data) => setState({ loading: false, error: null, items: data.data, pagination: data.pagination }))
      .catch(() =>
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat katalog. Periksa koneksi dan coba lagi.',
        })),
      );
  }, [appliedSearch, activeTab, appliedFilters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const beginFetch = () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
  };

  const applySearch = () => {
    beginFetch();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const applySidebarFilters = () => {
    beginFetch();
    setPage(1);
    setAppliedFilters({ courseId, genreId });
  };

  const resetFilters = () => {
    beginFetch();
    setSearch('');
    setAppliedSearch('');
    setActiveTab('Semua konten');
    setCourseId('');
    setGenreId('');
    setAppliedFilters({ courseId: '', genreId: '' });
    setPage(1);
  };

  const switchTab = (tab) => {
    beginFetch();
    setActiveTab(tab);
    setPage(1);
  };

  const goToPage = (next) => {
    beginFetch();
    setPage(next);
  };

  const pagination = state.pagination;

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Title */}
        <div>
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Digital Library
          </span>
          <h1 className="text-4xl font-serif text-stone-900 font-normal mt-1">
            Katalog Koleksi
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>
            <button
              onClick={applySearch}
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
                <div className="relative">
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#133227] appearance-none cursor-pointer"
                  >
                    <option value="">Semua mata kuliah</option>
                    {categories.courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.kode} - {course.nama}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-2">Genre</label>
                <div className="relative">
                  <select
                    value={genreId}
                    onChange={(e) => setGenreId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#133227] appearance-none cursor-pointer"
                  >
                    <option value="">Semua genre</option>
                    {categories.genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.nama} ({genre.contentType})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={applySidebarFilters}
                className="w-full bg-[#133227] hover:bg-[#0a2018] text-white py-3 rounded-xl font-semibold transition cursor-pointer"
              >
                Terapkan filter
              </button>

              <div className="text-center pt-2">
                <button
                  onClick={resetFilters}
                  className="text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
                >
                  Reset semua filter
                </button>
              </div>
            </div>
          </div>

          {/* CATALOG GRID */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>
                {pagination
                  ? `Menampilkan ${state.items.length} dari ${pagination.total} konten`
                  : 'Memuat...'}
              </span>
            </div>

            <ContentState
              loading={state.loading}
              error={state.error}
              empty={!state.loading && !state.error && state.items.length === 0}
              emptyHint="Tidak ada konten yang cocok dengan pencarian atau filter."
              onRetry={state.error ? load : undefined}
            />

            {!state.loading && !state.error && state.items.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {state.items.map((item) => (
                    <ContentCard key={item.id} content={item} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-stone-200/80 text-xs text-stone-500 gap-4">
                    <span>
                      Halaman {pagination.page} dari {pagination.totalPages}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => goToPage(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page <= 1}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:text-stone-300 disabled:cursor-not-allowed cursor-pointer"
                      >
                        ← Sebelumnya
                      </button>
                      <button
                        onClick={() => goToPage(Math.min(pagination.totalPages, pagination.page + 1))}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:text-stone-300 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Berikutnya →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
