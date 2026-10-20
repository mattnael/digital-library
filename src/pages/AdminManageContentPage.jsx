import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { Plus, ChevronDown } from 'lucide-react';

export default function AdminManageContentPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const contents = [
    { id: 1, title: 'Lorem Ipsum dolor sit amet', type: 'E-book', author: 'Lorem Ipsum', matkul: 'Lorem Ipsum', genre: 'Lorem Ipsum', status: 'Aktif' },
    { id: 2, title: 'Lorem Ipsum dolor sit amet', type: 'Research Paper', author: 'Lorem Ipsum', matkul: 'Lorem Ipsum', genre: 'Lorem Ipsum', status: 'Aktif' },
    { id: 3, title: 'Lorem Ipsum dolor sit amet', type: 'Video YouTube', author: 'Lorem Ipsum', matkul: 'Lorem Ipsum', genre: 'Lorem Ipsum', status: 'Aktif' },
    { id: 4, title: 'Lorem Ipsum dolor sit amet', type: 'E-book', author: 'Lorem Ipsum', matkul: 'Lorem Ipsum', genre: 'Lorem Ipsum', status: 'Aktif' },
    { id: 5, title: 'Lorem Ipsum dolor sit amet', type: 'E-book', author: 'Lorem Ipsum', matkul: 'Lorem Ipsum', genre: 'Lorem Ipsum', status: 'Aktif' },
    { id: 6, title: 'Lorem Ipsum dolor sit amet', type: 'E-book', author: 'Lorem Ipsum', matkul: 'Lorem Ipsum', genre: 'Lorem Ipsum', status: 'Aktif' },
    { id: 7, title: 'Lorem Ipsum dolor sit amet', type: 'E-book', author: 'Lorem Ipsum', matkul: 'Lorem Ipsum', genre: 'Lorem Ipsum', status: 'Aktif' },
    { id: 8, title: 'Lorem Ipsum dolor sit amet', type: 'Video YouTube', author: 'Lorem Ipsum', matkul: 'Lorem Ipsum', genre: 'Lorem Ipsum', status: 'Nonaktif' },
  ];

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Jenis konten</label>
              <div className="relative">
                <select className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#133227]">
                  <option>Semua jenis</option>
                  <option>E-book</option>
                  <option>Research Paper</option>
                  <option>Video YouTube</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Mata kuliah</label>
              <div className="relative">
                <select className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs text-stone-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#133227]">
                  <option>Semua mata kuliah</option>
                  <option>Interaksi Manusia & Komputer</option>
                  <option>Sains Data</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 px-6 py-2 rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer">
              Filter
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <span className="text-xs font-semibold text-stone-500 block">1.284 Konten Aktif</span>

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
                {contents.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900">{item.title}</td>
                    <td className="py-3.5 px-4">{item.type}</td>
                    <td className="py-3.5 px-4">{item.author}</td>
                    <td className="py-3.5 px-4">{item.matkul}</td>
                    <td className="py-3.5 px-4">{item.genre}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${item.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-stone-600 space-x-2">
                      <button className="text-[#133227] hover:underline cursor-pointer">Edit</button>
                      <span>·</span>
                      <button className="text-rose-600 hover:underline cursor-pointer">Nonaktifkan</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-stone-100 text-xs text-stone-500">
            <span>Menampilkan 1–6 dari 1.312 konten</span>
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
              <button className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700">
                Berikutnya →
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}