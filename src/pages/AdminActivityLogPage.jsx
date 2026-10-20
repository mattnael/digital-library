import AdminLayout from '../components/AdminLayout';
import { ChevronDown } from 'lucide-react';

export default function AdminActivityLogPage() {
  const logs = [
    { time: '19 Okt 2026\n09:44:12 WIB', action: 'VIEW', content: 'Pengantar Desain Komunikasi Visual', detail: 'Membuka e-book EPUB', ip: '192.168.1.42' },
    { time: '19 Okt 2026\n09:42:06 WIB', action: 'UPDATE', content: 'Pengantar Desain Komunikasi Visual', detail: 'Deskripsi dan ISBN diperbarui', ip: '192.168.1.10' },
    { time: '19 Okt 2026\n09:35:20 WIB', action: 'VIEW', content: 'Memahami Hierarki Visual', detail: 'Membuka video YouTube', ip: '192.168.1.57' },
    { time: '19 Okt 2026\n09:18:43 WIB', action: 'CREATE', content: 'Literasi Visual dalam Pembelajaran Digital', detail: 'Research paper baru; berkas PDF', ip: '192.168.1.11' },
    { time: '19 Okt 2026\n08:56:16 WIB', action: 'VIEW', content: 'Literasi Visual dalam Pembelajaran Digital', detail: 'Membuka research paper PDF', ip: '192.168.1.63' },
    { time: '19 Okt 2026\n08:45:31 WIB', action: 'DELETE', content: 'Pengantar Desain · Edisi 2020', detail: 'Soft delete; is_active: false', ip: '192.168.1.10' },
  ];

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
              <label className="text-xs font-semibold text-stone-700 block">Rentang tanggal</label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="19 Okt 2026 — 19 Okt 2026"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#133227]"
                  readOnly
                />
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Admin</label>
              <div className="relative">
                <select className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#133227]">
                  <option>Semua admin & pengguna</option>
                  <option>Admin Utama</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Aksi</label>
              <div className="relative">
                <select className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#133227]">
                  <option>Semua aksi</option>
                  <option>VIEW</option>
                  <option>CREATE</option>
                  <option>UPDATE</option>
                  <option>DELETE</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-2 border-t border-stone-100 text-xs">
            <span className="text-stone-400 text-[11px]">
              Aksi: VIEW · CREATE · UPDATE · DELETE
            </span>
            <div className="flex items-center gap-3">
              <button className="text-stone-500 hover:text-stone-800 font-medium cursor-pointer">
                Reset filter
              </button>
              <button className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-2 rounded-xl font-semibold transition cursor-pointer shadow-sm">
                Terapkan filter
              </button>
            </div>
          </div>
        </div>

        {/* Table Activity Logs */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center text-xs text-stone-500">
            <span>6 aktivitas ditemukan · 19 Oktober 2026</span>
            <span>Urutkan: Aktivitas Terbaru</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#e5ede9] text-[#133227] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Waktu</th>
                  <th className="py-3 px-4">Aksi</th>
                  <th className="py-3 px-4">Konten</th>
                  <th className="py-3 px-4">Detail Aktivitas</th>
                  <th className="py-3 px-4 rounded-r-xl">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500 whitespace-pre-line">
                      {log.time}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] ${
                        log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'UPDATE' ? 'bg-amber-100 text-amber-800' :
                        log.action === 'DELETE' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900">{log.content}</td>
                    <td className="py-3.5 px-4 text-stone-600">{log.detail}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-stone-100 text-xs text-stone-500">
            <span>Menampilkan 1–6 dari 8 aktivitas</span>
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-400" disabled>
                ← Sebelumnya
              </button>
              <button className="w-8 h-8 rounded-lg bg-[#133227] text-white font-semibold flex items-center justify-center">
                1
              </button>
              <button className="w-8 h-8 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center">
                2
              </button>
              <button className="w-8 h-8 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700">
                Berikutnya →
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}