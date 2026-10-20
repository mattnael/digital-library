import AdminLayout from '../components/AdminLayout';
import { Plus, ChevronDown } from 'lucide-react';

export default function AdminCategoryPage() {
  const mataKuliahList = [
    { kode: 'Lorem01', nama: 'Lorem Ipsum 01' },
    { kode: 'Ipsum02', nama: 'Lorem Ipsum 02' },
    { kode: 'dolor03', nama: 'Lorem Ipsum 03' },
    { kode: 'sit04', nama: 'Lorem Ipsum 04' },
    { kode: 'amet05', nama: 'Lorem Ipsum 05' },
  ];

  const genreList = [
    { genre: 'Genre 01', jenis: 'E-book' },
    { genre: 'Genre 02', jenis: 'Research Paper' },
    { genre: 'Genre 03', jenis: 'Research Paper' },
    { genre: 'Genre 04', jenis: 'Video YouTube' },
    { genre: 'Genre 05', jenis: 'E-book' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            Category
          </span>
          <h1 className="text-3xl font-serif text-stone-900 font-normal">
            Content Category
          </h1>
        </div>

        {/* Top Tables Grid: Mata Kuliah & Genre */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Tabel Mata Kuliah */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-stone-900">Mata kuliah</h3>
              <button className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Tambah mata kuliah
              </button>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#e5ede9] text-[#133227] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Kode</th>
                    <th className="py-3 px-4">Nama Mata Kuliah</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {mataKuliahList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition">
                      <td className="py-3.5 px-4 font-mono text-stone-500">{item.kode}</td>
                      <td className="py-3.5 px-4 font-semibold text-stone-900">{item.nama}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="text-[#133227] hover:underline font-semibold cursor-pointer">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Genre */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-stone-900">Genre</h3>
              <button className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Tambah genre
              </button>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#e5ede9] text-[#133227] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Nama Genre</th>
                    <th className="py-3 px-4">Jenis Konten</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {genreList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition">
                      <td className="py-3.5 px-4 font-semibold text-stone-900">{item.genre}</td>
                      <td className="py-3.5 px-4 text-stone-600">{item.jenis}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="text-[#133227] hover:underline font-semibold cursor-pointer">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Bottom Forms Grid: Edit Mata Kuliah & Tambah Genre */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form Edit Mata Kuliah */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">Edit mata kuliah</h3>
              <div>
                <span className="bg-[#e5ede9] text-[#133227] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                  Dipilih: Lorem01
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Kode mata kuliah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Lorem-Ipsum101"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#133227]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Nama mata kuliah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Lorem Ipsum 01"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#133227]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm">
                Simpan
              </button>
              <button className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs">
                Batal
              </button>
            </div>
          </div>

          {/* Form Tambah Genre */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-stone-900">Tambah genre</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Nama genre <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Lorem Ipsum"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#133227]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Jenis konten <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 text-xs text-stone-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#133227]">
                    <option>E-book</option>
                    <option>Research Paper</option>
                    <option>Video YouTube</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button className="bg-[#133227] hover:bg-[#0a2018] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm">
                Simpan
              </button>
              <button className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs">
                Batal
              </button>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}