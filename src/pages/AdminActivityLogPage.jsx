import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import ContentState from '../components/ContentState';
import { adminApi } from '../api/endpoints';
import { formatDateTime } from '../utils/format';
import { ChevronDown } from 'lucide-react';

const ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REGISTER'];

const ACTION_BADGE = {
  CREATE: 'bg-emerald-100 text-emerald-800',
  UPDATE: 'bg-amber-100 text-amber-800',
  DELETE: 'bg-rose-100 text-rose-800',
};

export default function AdminActivityLogPage() {
  const [filters, setFilters] = useState({ from: '', to: '', action: '', userId: '' });
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: null, logs: [], pagination: null });

  const load = useCallback(() => {
    adminApi
      .activityLogs({
        from: filters.from || undefined,
        to: filters.to || undefined,
        action: filters.action || undefined,
        userId: filters.userId || undefined,
        page,
        limit: 10,
      })
      .then((data) =>
        setState({ loading: false, error: null, logs: data.data, pagination: data.pagination }),
      )
      .catch(() =>
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat log aktivitas. Coba lagi beberapa saat.',
        })),
      );
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = (name, value) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setFilters({ from: '', to: '', action: '', userId: '' });
    setPage(1);
  };

  const goToPage = (next) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setPage(next);
  };

  useEffect(() => {
    adminApi
      .users()
      .then((data) => setUsers(data.data))
      .catch(() => {
        // Dropdown filter pengguna kosong; tabel tetap bisa difilter per aksi.
      });
  }, []);

  const pagination = state.pagination;
  const today = new Date().toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Title & Badge */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
              Activity Logs
            </span>
            <h1 className="text-3xl font-serif text-stone-900 font-normal">
              Activity Logs
            </h1>
          </div>
          <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
            Read-Only
          </span>
        </div>

        {/* Filter Section Card */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Dari tanggal</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilter('from', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Sampai tanggal</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilter('to', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Aksi</label>
              <div className="relative">
                <select
                  value={filters.action}
                  onChange={(e) => setFilter('action', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#133227] cursor-pointer"
                >
                  <option value="">Semua aksi</option>
                  {ACTIONS.map((action) => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-semibold text-stone-700 block">Pengguna</label>
              <div className="relative">
                <select
                  value={filters.userId}
                  onChange={(e) => setFilter('userId', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#133227] cursor-pointer"
                >
                  <option value="">Semua admin & pengguna</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.role === 'ADMIN' ? 'Admin' : 'Pengguna'})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-2 border-t border-stone-100 text-xs">
            <span className="text-stone-400 text-[11px]">
              Aksi: VIEW · CREATE · UPDATE · DELETE · LOGIN · LOGOUT · REGISTER
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
              >
                Reset filter
              </button>
            </div>
          </div>
        </div>

        {/* Table Activity Logs */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center text-xs text-stone-500">
            <span>
              {pagination
                ? `${pagination.total.toLocaleString('id-ID')} aktivitas ditemukan · ${today}`
                : 'Memuat...'}
            </span>
            <span>Urutkan: Aktivitas Terbaru</span>
          </div>

          <ContentState
            loading={state.loading}
            error={state.error}
            empty={!state.loading && !state.error && state.logs.length === 0}
            emptyHint="Tidak ada aktivitas yang cocok dengan filter."
            onRetry={state.error ? load : undefined}
          />

          {!state.loading && !state.error && state.logs.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#e5ede9] text-[#133227] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 rounded-l-xl">Waktu</th>
                      <th className="py-3 px-4">Aksi</th>
                      <th className="py-3 px-4">Pengguna</th>
                      <th className="py-3 px-4">Konten</th>
                      <th className="py-3 px-4">Detail Aktivitas</th>
                      <th className="py-3 px-4 rounded-r-xl">Alamat IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {state.logs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50 transition">
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                          {formatDateTime(log.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] ${ACTION_BADGE[log.action] || 'bg-stone-100 text-stone-700'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800">{log.userName || '-'}</span>
                          {log.userRole && (
                            <span className="block text-[10px] text-stone-400">
                              {log.userRole === 'ADMIN' ? 'Admin' : 'Pengguna'}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                          {log.contentTitle || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">{log.detail || '-'}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                          {log.ipAddress || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-stone-100 text-xs text-stone-500 gap-4">
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
    </AdminLayout>
  );
}
