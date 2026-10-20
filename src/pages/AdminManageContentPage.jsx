import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ContentState from '../components/ContentState';
import { contentApi, categoryApi } from '../api/endpoints';
import { apiErrorMessage } from '../utils/format';
import { Plus, ChevronDown } from 'lucide-react';

const TYPES = ['E-book', 'Research Paper', 'Video YouTube'];

export default function AdminManageContentPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [type, setType] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: null, items: [], pagination: null });
  const [actionError, setActionError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    categoryApi
      .list()
      .then((data) => setCourses(data.courses))
      .catch(() => {});
  }, []);

  const load = useCallback(() => {
    contentApi
      .list({
        search: searchInput.trim() || undefined,
        type: type || undefined,
        courseId: courseId || undefined,
        includeInactive: true,
        page,
        limit: 10,
      })
      .then((data) =>
        setState({ loading: false, error: null, items: data.data, pagination: data.pagination }),
      )
      .catch(() =>
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat daftar konten. Coba lagi beberapa saat.',
        })),
      );
  }, [searchInput, type, courseId, page]);

  useEffect(() => {
    load();
  }, [load]);

  const beginFetch = () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Nonaktifkan konten "${item.title}"? Konten disembunyikan dari katalog.`)) {
      return;
    }
    setDeletingId(item.id);
    setActionError('');
    try {
      await contentApi.remove(item.id);
      load();
    } catch (error) {
      setActionError(apiErrorMessage(error, 'Gagal menonaktifkan konten.'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleActivate = async (item) => {
    setDeletingId(item.id);
    setActionError('');
    try {
      await contentApi.setStatus(item.id, true);
      load();
    } catch (error) {
      setActionError(apiErrorMessage(error, 'Gagal mengaktifkan konten.'));
    } finally {
      setDeletingId(null);
    }
  };

  const pagination = state.pagination;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header & Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
              Manage Content
            </span>
            <h1 className="text-3xl font-serif text-stone-900 font-normal">
              Manage Content
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/content/create')}
            className="bg-[#133227] hover:bg-[#0a2018] text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Konten
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Cari konten</label>
              <input
                type="text"
                placeholder="Judul atau penulis..."
                value={searchInput}
                onChange={(e) => {
                  beginFetch();
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Jenis konten</label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => {
                    beginFetch();
                    setType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#133227] cursor-pointer"
                >
                  <option value="">Semua jenis</option>
                  {TYPES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Mata kuliah</label>
              <div className="relative">
                <select
                  value={courseId}
                  onChange={(e) => {
                    beginFetch();
                    setCourseId(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#133227] cursor-pointer"
                >
                  <option value="">Semua mata kuliah</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.kode} - {course.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {actionError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 font-semibold">
            {actionError}
          </div>
        )}

        {/* Table Content */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <span className="text-xs font-semibold text-stone-500 block">
            {pagination ? `${pagination.total.toLocaleString('id-ID')} Konten` : 'Memuat...'}
          </span>

          <ContentState
            loading={state.loading}
            error={state.error}
            empty={!state.loading && !state.error && state.items.length === 0}
            emptyHint="Belum ada konten. Tambahkan konten pertama lewat tombol Tambah Konten."
            onRetry={state.error ? load : undefined}
          />

          {!state.loading && !state.error && state.items.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#e5ede9] text-[#133227] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 rounded-l-xl">Judul Konten</th>
                      <th className="py-3 px-4">Jenis</th>
                      <th className="py-3 px-4">Penulis / Channel</th>
                      <th className="py-3 px-4">Mata Kuliah</th>
                      <th className="py-3 px-4">Genre</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {state.items.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50 transition">
                        <td className="py-3.5 px-4 font-serif font-bold text-stone-900">{item.title}</td>
                        <td className="py-3.5 px-4">{item.contentType}</td>
                        <td className="py-3.5 px-4">{item.author}</td>
                        <td className="py-3.5 px-4">{item.course?.nama || '-'}</td>
                        <td className="py-3.5 px-4">{item.genre?.nama || '-'}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                            {item.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-stone-600 space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/admin/content/create?edit=${item.id}`)}
                            className="text-[#133227] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          {item.isActive ? (
                            <button
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.id}
                              className="text-rose-600 hover:underline cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === item.id ? 'Memproses...' : 'Nonaktifkan'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(item)}
                              disabled={deletingId === item.id}
                              className="text-emerald-700 hover:underline cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === item.id ? 'Memproses...' : 'Aktifkan'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-stone-100 text-xs text-stone-500 gap-4">
                  <span>
                    Halaman {pagination.page} dari {pagination.totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:text-stone-300 disabled:cursor-not-allowed cursor-pointer"
                    >
                      ← Sebelumnya
                    </button>
                    <button
                      onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
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
    </AdminLayout>
  );
}
