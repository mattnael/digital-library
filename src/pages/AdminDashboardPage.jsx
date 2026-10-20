import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const activityLogs = [
    { date: '19 Okt 2026 - 09:42', action: 'UPDATE', content: 'Lorem Ipsum dolor sit amet', ket: 'Lorem Ipsum dolor sit amet' },
    { date: '19 Okt 2026 - 09:18', action: 'CREATE', content: 'Lorem Ipsum dolor sit amet', ket: 'Lorem Ipsum dolor sit amet' },
    { date: '19 Okt 2026 - 08:56', action: 'DELETE', content: 'Lorem Ipsum dolor sit amet', ket: 'Lorem Ipsum dolor sit amet' },
    { date: '19 Okt 2026 - 08:30', action: 'UPDATE', content: 'Lorem Ipsum dolor sit amet', ket: 'Lorem Ipsum dolor sit amet' },
    { date: '19 Okt 2026 - 08:03', action: 'UPDATE', content: 'Lorem Ipsum dolor sit amet', ket: 'Lorem Ipsum dolor sit amet' },
    { date: '19 Okt 2026 - 07:48', action: 'CREATE', content: 'Lorem Ipsum dolor sit amet', ket: 'Lorem Ipsum dolor sit amet' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            DASHBOARD
          </span>
          <h1 className="text-3xl font-serif text-stone-900 font-normal">
            Welcome, Admin
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#133227] text-white rounded-2xl p-6 shadow-sm space-y-2">
            <span className="text-[11px] font-semibold text-emerald-300">Total Contents</span>
            <div className="text-3xl font-serif font-bold">1.284</div>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-2">
            <span className="text-[11px] font-semibold text-stone-500">E-book</span>
            <div className="text-3xl font-serif font-bold text-stone-900">642</div>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-2">
            <span className="text-[11px] font-semibold text-stone-500">Research Paper</span>
            <div className="text-3xl font-serif font-bold text-stone-900">418</div>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-2">
            <span className="text-[11px] font-semibold text-stone-500">Video YouTube</span>
            <div className="text-3xl font-serif font-bold text-stone-900">224</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/admin/content')}
            className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer space-y-3 group"
          >
            <h3 className="text-lg font-serif font-bold text-stone-900">Kelola konten</h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#133227] group-hover:translate-x-1 transition">
              <span>Buka koleksi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/admin/category')}
            className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer space-y-3 group"
          >
            <h3 className="text-lg font-serif font-bold text-stone-900">Kelola kategori</h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#133227] group-hover:translate-x-1 transition">
              <span>Buka kategori</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/admin/activity-log')}
            className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer space-y-3 group"
          >
            <h3 className="text-lg font-serif font-bold text-stone-900">Log aktivitas</h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#133227] group-hover:translate-x-1 transition">
              <span>Lihat aktivitas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Newest Activity Log Section */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif text-stone-900">Newest Activity Log</h3>
            <button 
              onClick={() => navigate('/admin/activity-log')}
              className="bg-white border border-stone-200 hover:bg-stone-50 px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              View Activity Logs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#e5ede9] text-[#133227] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Date & Time</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Konten</th>
                  <th className="py-3 px-4 rounded-r-xl">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {activityLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px]">{log.date}</td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'UPDATE' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{log.content}</td>
                    <td className="py-3.5 px-4 text-stone-500">{log.ket}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}